"""Render a promo's overlay track (intro card, scene type, end card) as RGBA PNG frames.

    python3 build_overlay.py <promo_dir> <out_dir> <fonts_dir> [square|vertical]

Everything promo-specific lives in <promo_dir>/promo.json (see video/README.md). Times
are on the music grid (100 BPM, 0.6s per beat) and, except the intro, are measured from
the end of the intro card. Scenes run back to back; the end card follows the last scene.

Scene types:
  words   reveal a line word by word         {"text", "at", "step"}
  swap    show A, optionally strike it, then replace it with B
                                              {"a", "a_at", "strike_at"|null, "b", "b_at"}
  accent  a line whose second half turns mint at a moment in the clip
                                              {"left", "right", "at", "accent_at"}
  sequence  a small kicker over a big word that changes on cue; optional "marks" put a
            mint underline under the thing each word names (square-frame x, y per item)
                                              {"kicker", "kicker_at"?, "items": [[word, at], ...],
                                               "marks"?: [[x, y], ...]}
Any scene may set "size" (px, default 84) for its type.

Storyboard rules: one line of type per scene, no hard cuts, real logo only (recoloured,
never redrawn), contact details exactly as on the website.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PROMO, OUT, FONTS = sys.argv[1:4]
FORMAT = sys.argv[4] if len(sys.argv) > 4 else "square"
cfg = json.load(open(os.path.join(PROMO, "promo.json")))
BRAND = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "brand", "approved-reference")

FPS, W = 24, 1080
BEAT = cfg.get("beat", 0.6)  # seconds per beat of the promo's music
INTRO = cfg["intro"]["duration"]
SCENES = cfg["scenes"]
STARTS = np.cumsum([0] + [s["duration"] for s in SCENES]).tolist()
E = STARTS[-1]  # end of the last scene = start of the end card
BODY = E + cfg["end_card"]["duration"]
DUR = INTRO + BODY

# Square: everything on the 1080 canvas. Vertical (9:16): the square footage sits at
# promo.json "vertical_footage_y" (default 420, centred; assemble.py uses the same value),
# cards fill the full frame, and type stays at y=1160, inside the Reels/Stories safe area
# (clear of the top 14% and bottom 35%).
H = 1920 if FORMAT == "vertical" else 1080
VOFF = cfg.get("vertical_footage_y", 420) if FORMAT == "vertical" else 0
CARD_DY = (H - W) // 2
TEXT_Y = 1160 if FORMAT == "vertical" else 840
LINE_Y = VOFF + cfg["line_y"]  # flow-line height in the last clip's final frame

NAVY, COBALT, PAPER = (21, 34, 56), (47, 100, 214), (247, 244, 237)
MINT, CORAL, MUTED = (184, 225, 208), (233, 120, 93), (201, 209, 220)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


_fonts = {}


def H1(size=84):
    if size not in _fonts:
        _fonts[size] = font("Manrope-800.ttf", size)
    return _fonts[size]


TAG = font("Inter-500.ttf", 36)
URL = font("Inter-600.ttf", 30)
KICK = font("Inter-600.ttf", 26)
SMALL = font("Inter-600.ttf", 30)


def clamp(x):
    return max(0.0, min(1.0, x))


def ease_out(x):
    return 1 - (1 - clamp(x)) ** 3


def ease_in(x):
    return clamp(x) ** 2


def prog(t, a, b):
    return clamp((t - a) / (b - a))


_cache = {}


def text_layer(text, fnt, fill, shadow=True):
    key = (text, id(fnt), fill, shadow)
    if key not in _cache:
        l, top, r, bot = fnt.getbbox(text)
        pad = 30
        im = Image.new("RGBA", (r - l + 2 * pad, bot - top + 2 * pad), (0, 0, 0, 0))
        if shadow:
            sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
            ImageDraw.Draw(sh).text((pad - l, pad - top + 4), text, font=fnt, fill=(5, 10, 20, 200))
            im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(9)))
        ImageDraw.Draw(im).text((pad - l, pad - top), text, font=fnt, fill=fill)
        _cache[key] = (im, pad, r - l)
    return _cache[key]


def put(canvas, layer, x, y, alpha=1.0):
    if alpha <= 0:
        return
    if alpha < 1:
        layer = layer.copy()
        layer.putalpha(layer.getchannel("A").point(lambda v: int(v * alpha)))
    canvas.alpha_composite(layer, (int(round(x)), int(round(y))))


def centered(canvas, text, fnt, fill, y, alpha=1.0, dy=0.0, shadow=True):
    im, pad, w = text_layer(text, fnt, fill, shadow)
    put(canvas, im, W / 2 - w / 2 - pad, y - pad + dy, alpha)
    return W / 2 - w / 2, w


def rise(t, a, out_a=None, out_b=None, dist=28):
    p = ease_out(prog(t, a, a + 0.35))
    alpha = p * (1 - prog(t, out_a, out_b)) if out_a is not None else p
    return alpha, (1 - p) * dist


def rgba_from(arr_rgb, alpha):
    a = np.dstack([np.broadcast_to(arr_rgb, alpha.shape + (3,)), np.clip(alpha, 0, 1) * 255]).astype(np.uint8)
    return Image.fromarray(a, "RGBA")


def blank():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def tracked(text, fnt, fill, spacing):
    w = sum(fnt.getlength(ch) for ch in text) + spacing * (len(text) - 1)
    im = Image.new("RGBA", (int(w) + 4, fnt.getbbox(text)[3] + 6), (0, 0, 0, 0))
    d, x = ImageDraw.Draw(im), 0
    for ch in text:
        d.text((x, 0), ch, font=fnt, fill=fill)
        x += fnt.getlength(ch) + spacing
    return im


gy, gx = np.mgrid[0:H, 0:W].astype(np.float32)

# Scrim behind the scene type so it reads over any generated frame
SCRIM = rgba_from(np.array([11, 20, 36], np.float32), np.clip((gy - (TEXT_Y - 240)) / 480, 0, 1) ** 1.4 * (175 / 255))

# Dark card background (intro + end card): the site's dark-hero gradient, cobalt glow, hero zigzag
k = np.clip((gx / W + gy / H) / 2, 0, 1)[..., None]
bg = np.array([16, 27, 45], np.float32) * (1 - k) + np.array([28, 45, 69], np.float32) * k
glow = np.clip(1 - np.sqrt((gx - 0.8 * W) ** 2 + (gy - 0.2 * H) ** 2) / (0.35 * W * 1.414), 0, 1)[..., None]
bg = bg * (1 - 0.25 * glow) + np.array(COBALT, np.float32) * 0.25 * glow
CARD_BG = Image.fromarray(bg.astype(np.uint8), "RGB").convert("RGBA")
pat = blank()
pd = ImageDraw.Draw(pat)
for row, y0 in enumerate((90, H - 210)):  # 180px-step zigzag with nodes on the peaks (gm-hero-pattern.svg)
    pts = [(-20 + 180 * i + (90 if row else 0), y0 + (0 if i % 2 else 180)) for i in range(9)]
    pd.line(pts, fill=COBALT + (90,), width=2, joint="curve")
    for x, y in pts:
        if y == y0:
            pd.ellipse([x - 9, y - 9, x + 9, y + 9], fill=COBALT + (90,))
CARD_BG.alpha_composite(pat)

# Reversed logo: the approved artwork recoloured (navy -> paper, cobalt rule kept), never redrawn
src = Image.open(os.path.join(BRAND, "gm-logo-horizontal-approved.png")).convert("RGBA")
LOGO_W = 820
src = src.resize((LOGO_W, round(src.height * LOGO_W / src.width)), Image.LANCZOS)
la = np.asarray(src).astype(np.float32)
blue = (la[..., 2] - la[..., 0]) > 60
LOGO_IMG = rgba_from(np.where(blue[..., None], np.array([92, 140, 240], np.float32), np.array(PAPER, np.float32)), la[..., 3] / 255)
LOGO_X, LOGO_Y = (W - LOGO_W) // 2, CARD_DY + 300
LOGO_GLOW = blank()
LOGO_GLOW.alpha_composite(rgba_from(np.array([255, 255, 255], np.float32), la[..., 3] / 255), (LOGO_X, LOGO_Y))
LOGO_GLOW = LOGO_GLOW.filter(ImageFilter.GaussianBlur(26))

m = Image.open(os.path.join(BRAND, "gm-mark-approved.png")).convert("RGBA")
MARK_W = 132
m = m.resize((MARK_W, round(m.height * MARK_W / m.width)), Image.LANCZOS)
MARK_IMG = rgba_from(np.array(PAPER, np.float32), np.asarray(m).astype(np.float32)[..., 3] / 255)

INTRO_KICK = tracked(cfg["intro"]["kicker"], KICK, MINT, 9)
INTRO_TITLE = cfg["intro"]["title"]
END = cfg["end_card"]
END_LINE = tracked(END["line"], SMALL, MINT, 0) if END.get("line") else None
LIGHT_R = 1460 * H / W  # big enough to white out the whole frame


def light_field(cx, cy, radius, strength):
    d = np.sqrt((gx - cx) ** 2 + (gy - cy) ** 2)
    core = np.clip((1 - d / max(radius, 1)) * 2.2, 0, 1) ** 1.2
    return rgba_from(np.array([235, 242, 255], np.float32), core * strength)


def intro(t):
    c = CARD_BG.copy()
    al, dy = rise(t, 0.2)
    put(c, MARK_IMG, (W - MARK_W) / 2, CARD_DY + 350 + dy, al)
    al, dy = rise(t, BEAT)
    put(c, INTRO_KICK, (W - INTRO_KICK.width) / 2, CARD_DY + 550 + dy, al)
    p = ease_out(prog(t, 2 * BEAT, 2 * BEAT + 0.5))  # title lands on beat 3, resolving out of a soft blur
    if p > 0:
        im, pad, tw = text_layer(INTRO_TITLE, H1(), PAPER, False)
        if p < 1:
            im = im.filter(ImageFilter.GaussianBlur((1 - p) * 12))
        put(c, im, W / 2 - tw / 2 - pad, CARD_DY + 610 - pad + (1 - p) * 20, p)
    s = ease_out(prog(t, 3 * BEAT, 3 * BEAT + 0.45))  # cobalt rule (the logo's underline) draws out from centre on beat 4
    if s > 0:
        tw = H1().getlength(INTRO_TITLE)
        y = CARD_DY + 730
        ImageDraw.Draw(c).line([(W / 2 - tw / 2 * s, y), (W / 2 + tw / 2 * s, y)], fill=(92, 140, 240, 255), width=5)
    return c


def end_card(t):
    c = CARD_BG.copy()
    r = ease_out(prog(t, E, E + 0.9))  # logo resolves out of light
    if r < 1:
        blur = (1 - r) * 22
        put(c, LOGO_IMG.filter(ImageFilter.GaussianBlur(blur)) if blur > 0.5 else LOGO_IMG, LOGO_X, LOGO_Y, 0.35 + 0.65 * r)
    else:
        put(c, LOGO_IMG, LOGO_X, LOGO_Y)
    put(c, LOGO_GLOW, 0, 0, 0.9 * (1 - r) + 0.22)  # glow settles to a soft halo
    tag_at = E + 0.9
    if END_LINE is not None:  # optional tracked line under the logo, then everything else a beat later
        al, dy = rise(t, E + 0.9)
        put(c, END_LINE, (W - END_LINE.width) / 2, CARD_DY + 538 + dy, al)
        tag_at = E + 1.5
    al, dy = rise(t, tag_at)
    centered(c, END["tagline"][0], TAG, PAPER, CARD_DY + 620, al, dy, False)
    centered(c, END["tagline"][1], TAG, PAPER, CARD_DY + 672, al, dy, False)
    al, dy = rise(t, tag_at + 0.9)
    centered(c, END["contact"], URL, MINT, CARD_DY + 790, al, dy, False)
    return c


def scene_words(c, t, s, end, Y):
    f = H1(s.get("size", 84))
    words = s["text"].split(" ")
    x = W / 2 - f.getlength(s["text"]) / 2
    for i, wd in enumerate(words):
        al, dy = rise(t, s["at"] + i * s.get("step", 0.3), end - 0.35, end - 0.05)
        im, pad, _ = text_layer(wd, f, PAPER)
        put(c, im, x - pad, Y - pad + dy, al)
        x += f.getlength(wd + " ")


def scene_swap(c, t, s, end, Y):
    f = H1(s.get("size", 84))
    strike = s.get("strike_at")
    al, dy = rise(t, s["a_at"])
    al *= 1 - prog(t, s["b_at"] - 0.05, s["b_at"] + 0.1)
    x0, w = centered(c, s["a"], f, MUTED if strike is not None else PAPER, Y, al, dy)
    if strike is not None:
        sp = ease_out(prog(t, strike, strike + 0.25))
        if sp > 0 and al > 0:
            l, top, r, bot = f.getbbox(s["a"])
            ln = blank()
            ym = Y + (bot - top) * 0.56 + dy
            ImageDraw.Draw(ln).line([(x0 - 14, ym), (x0 - 14 + (w + 28) * sp, ym)], fill=CORAL + (255,), width=11)
            put(c, ln, 0, 0, al)
    p = ease_out(prog(t, s["b_at"], s["b_at"] + 0.35))
    centered(c, s["b"], f, MINT, Y, p * (1 - prog(t, end - 0.25, end)), (1 - p) * 28)


def scene_accent(c, t, s, end, Y):
    f = H1(s.get("size", 84))
    al, dy = rise(t, s["at"], end - 0.4, end - 0.2)
    lw, rw = f.getlength(s["left"] + " "), f.getlength(s["right"])
    x0 = W / 2 - (lw + rw) / 2
    mix = ease_out(prog(t, s["accent_at"] - 0.05, s["accent_at"] + 0.2))
    col = tuple(int(PAPER[i] + (MINT[i] - PAPER[i]) * mix) for i in range(3))
    im, pad, _ = text_layer(s["left"], f, PAPER)
    put(c, im, x0 - pad, Y - pad + dy, al)
    im, pad, _ = text_layer(s["right"], f, col)
    put(c, im, x0 + lw - pad, Y - pad + dy, al)


def scene_sequence(c, t, s, end, Y):
    f = H1(s.get("size", 92))
    items = s["items"]
    kick = tracked(s["kicker"], KICK, MINT, 9)
    al, dy = rise(t, s.get("kicker_at", items[0][1] - 0.3), end - 0.4, end - 0.2)
    put(c, kick, (W - kick.width) / 2, Y - 58 + dy, al)
    for i, (word, at) in enumerate(items):
        nxt = items[i + 1][1] if i + 1 < len(items) else None
        out_a, out_b = (nxt - 0.12, nxt) if nxt is not None else (end - 0.4, end - 0.2)
        al, dy = rise(t, at, out_a, out_b, dist=22)
        if al > 0:
            centered(c, word, f, PAPER if nxt is not None else MINT, Y, al, dy)
            if s.get("marks"):
                mx, my = s["marks"][i]
                grow = ease_out(prog(t, at, at + 0.3))
                ln = blank()
                seg = [(mx - 36 * grow, VOFF + my), (mx + 36 * grow, VOFF + my)]
                ImageDraw.Draw(ln).line(seg, fill=MINT + (255,), width=12)
                ln = ln.filter(ImageFilter.GaussianBlur(7))
                ImageDraw.Draw(ln).line(seg, fill=MINT + (255,), width=4)
                put(c, ln, 0, 0, al)


DRAW = {"words": scene_words, "swap": scene_swap, "accent": scene_accent, "sequence": scene_sequence}


def body(t):
    c = blank()
    if t < E:
        c.alpha_composite(SCRIM)
        for s, a, b in zip(SCENES, STARTS, STARTS[1:]):
            if a <= t < b:
                DRAW[s["type"]](c, t, s, b, TEXT_Y)
        if E - 0.5 <= t:  # the flow line contracts to centre...
            half = (1 - ease_in(prog(t, E - 0.5, E - 0.15))) * 620 + 6
            seg = [(W / 2 - half, LINE_Y), (W / 2 + half, LINE_Y)]
            ln = blank()
            ImageDraw.Draw(ln).line(seg, fill=(170, 200, 255, 255), width=14)
            c.alpha_composite(ln.filter(ImageFilter.GaussianBlur(10)))
            ImageDraw.Draw(c).line(seg, fill=(245, 248, 255, 255), width=4)
        if t >= E - 0.25:  # ...and the point blooms into light
            b = ease_in(prog(t, E - 0.25, E))
            c.alpha_composite(light_field(W / 2, LINE_Y, 60 + b * (LIGHT_R - 60), 0.4 + 0.6 * b))
    else:
        c = end_card(t)
        fade = 1 - ease_out(prog(t, E, E + 0.45))  # light clears, logo is left glowing
        if fade > 0:
            c.alpha_composite(light_field(W / 2, LINE_Y, LIGHT_R, fade))
    return c


def frame(t):
    if t >= INTRO + 0.2:
        return body(t - INTRO)
    c = blank()  # scene type starts later, so only the scrim is needed under the intro dissolve
    if t >= INTRO - 0.2:
        sc = SCRIM.copy()
        sc.putalpha(sc.getchannel("A").point(lambda v: int(v * prog(t, INTRO - 0.2, INTRO + 0.2))))
        c.alpha_composite(sc)
    card = intro(t)
    card.putalpha(int(255 * (1 - prog(t, INTRO - 0.2, INTRO + 0.2))))  # dissolve into the first scene
    c.alpha_composite(card)
    return c


os.makedirs(OUT, exist_ok=True)
n = int(DUR * FPS)
for i in range(n):
    frame(i / FPS).save(os.path.join(OUT, f"o_{i:04d}.png"), compress_level=1)
print(f"{FORMAT}: {n} frames {W}x{H}, {DUR:.1f}s")
