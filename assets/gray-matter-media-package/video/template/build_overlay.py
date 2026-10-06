"""Render the promo overlay track (kinetic type, intro card, end card) as RGBA PNG frames.

    python3 build_overlay.py <out_dir> <logo.png> <mark.png> <fonts_dir> [square|vertical]

The overlay sits on top of the three generated clips (see assemble.sh). Everything is
timed to the music grid: 100 BPM, 0.6s per beat. Times in body() are measured from the
end of the intro card, so the intro can grow or shrink without retiming the scenes.

  Intro 0.0-3.6   "Introducing <SERVICE>" title card
  S1    0.0-3.6   chaos           "Drowning in DMs?"
  S2    3.6-7.2   chaos -> order  "Manual" struck out -> "Automatic."
  S3    7.2-10.8  approval        "You approve. It sends."  (toggle flips at 10.08)
  End   10.8-16.8 dark end card: logo resolves out of light, tagline, URL + phone

Rules from the storyboard (Cut B): one line of type per scene, no hard cuts, real logo
only (recoloured, never redrawn), contact details exactly as on the website.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT, LOGO, MARK, FONTS = sys.argv[1:5]
FORMAT = sys.argv[5] if len(sys.argv) > 5 else "square"

# ---- Per-promo copy: change these for the next service in the series ----
SERVICE = "Workflow Automation"
TAGLINE = ("Tell us what needs to change.", "We figure out the technology.")
CONTACT = "graymatterdigitalsolutions.com · (334) 652-2601"

FPS, W = 24, 1080
INTRO = 3.6  # six beats; the body starts here
BODY = 16.8  # scenes 10.8s + end card 6.0s
DUR = INTRO + BODY

# Square: everything on the 1080 canvas. Vertical (9:16): the square footage sits centred
# at y=420 (assemble.sh), cards fill the full frame, and type stays inside the Reels/Stories
# safe area (clear of the top 14% and bottom 35%).
H = 1920 if FORMAT == "vertical" else 1080
VOFF = (H - W) // 2  # where the square footage sits
CARD_DY = (H - W) // 2  # card content is laid out on a 1080 grid, then centred
TEXT_Y = VOFF + (740 if FORMAT == "vertical" else 840)

NAVY, COBALT, PAPER = (21, 34, 56), (47, 100, 214), (247, 244, 237)
MINT, CORAL = (184, 225, 208), (233, 120, 93)
LINE_Y, TOGGLE_ON = VOFF + 554, 10.08  # flow line height and toggle flip, measured from the S3 clip


def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)


H1 = font("Manrope-800.ttf", 84)
TAG = font("Inter-500.ttf", 36)
URL = font("Inter-600.ttf", 30)
KICK = font("Inter-600.ttf", 26)


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
src = Image.open(LOGO).convert("RGBA")
LOGO_W = 820
src = src.resize((LOGO_W, round(src.height * LOGO_W / src.width)), Image.LANCZOS)
la = np.asarray(src).astype(np.float32)
blue = (la[..., 2] - la[..., 0]) > 60
LOGO_IMG = rgba_from(np.where(blue[..., None], np.array([92, 140, 240], np.float32), np.array(PAPER, np.float32)), la[..., 3] / 255)
LOGO_X, LOGO_Y = (W - LOGO_W) // 2, CARD_DY + 300
LOGO_GLOW = blank()
LOGO_GLOW.alpha_composite(rgba_from(np.array([255, 255, 255], np.float32), la[..., 3] / 255), (LOGO_X, LOGO_Y))
LOGO_GLOW = LOGO_GLOW.filter(ImageFilter.GaussianBlur(26))

m = Image.open(MARK).convert("RGBA")
MARK_W = 132
m = m.resize((MARK_W, round(m.height * MARK_W / m.width)), Image.LANCZOS)
MARK_IMG = rgba_from(np.array(PAPER, np.float32), np.asarray(m).astype(np.float32)[..., 3] / 255)


def tracked(text, fnt, fill, spacing):
    w = sum(fnt.getlength(ch) for ch in text) + spacing * (len(text) - 1)
    im = Image.new("RGBA", (int(w) + 4, fnt.getbbox(text)[3] + 6), (0, 0, 0, 0))
    d, x = ImageDraw.Draw(im), 0
    for ch in text:
        d.text((x, 0), ch, font=fnt, fill=fill)
        x += fnt.getlength(ch) + spacing
    return im


KICK_IMG = tracked("INTRODUCING", KICK, MINT, 9)
LIGHT_R = 1460 * H / W  # big enough to white out the whole frame


def light_field(cx, cy, radius, strength):
    d = np.sqrt((gx - cx) ** 2 + (gy - cy) ** 2)
    core = np.clip((1 - d / max(radius, 1)) * 2.2, 0, 1) ** 1.2
    return rgba_from(np.array([235, 242, 255], np.float32), core * strength)


def intro(t):
    c = CARD_BG.copy()
    al, dy = rise(t, 0.2)
    put(c, MARK_IMG, (W - MARK_W) / 2, CARD_DY + 350 + dy, al)
    al, dy = rise(t, 0.6)
    put(c, KICK_IMG, (W - KICK_IMG.width) / 2, CARD_DY + 550 + dy, al)
    p = ease_out(prog(t, 1.2, 1.7))  # title lands on beat 3, resolving out of a soft blur
    if p > 0:
        im, pad, tw = text_layer(SERVICE, H1, PAPER, False)
        if p < 1:
            im = im.filter(ImageFilter.GaussianBlur((1 - p) * 12))
        put(c, im, W / 2 - tw / 2 - pad, CARD_DY + 610 - pad + (1 - p) * 20, p)
    s = ease_out(prog(t, 1.8, 2.25))  # cobalt rule (the logo's underline) draws out from centre on beat 4
    if s > 0:
        tw = H1.getlength(SERVICE)
        y = CARD_DY + 730
        ImageDraw.Draw(c).line([(W / 2 - tw / 2 * s, y), (W / 2 + tw / 2 * s, y)], fill=(92, 140, 240, 255), width=5)
    return c


def end_card(t):
    c = CARD_BG.copy()
    r = ease_out(prog(t, 10.8, 11.7))  # logo resolves out of light
    if r < 1:
        blur = (1 - r) * 22
        put(c, LOGO_IMG.filter(ImageFilter.GaussianBlur(blur)) if blur > 0.5 else LOGO_IMG, LOGO_X, LOGO_Y, 0.35 + 0.65 * r)
    else:
        put(c, LOGO_IMG, LOGO_X, LOGO_Y)
    put(c, LOGO_GLOW, 0, 0, 0.9 * (1 - r) + 0.22)  # glow settles to a soft halo
    al, dy = rise(t, 11.7)
    centered(c, TAGLINE[0], TAG, PAPER, CARD_DY + 620, al, dy, False)
    centered(c, TAGLINE[1], TAG, PAPER, CARD_DY + 672, al, dy, False)
    al, dy = rise(t, 12.6)
    centered(c, CONTACT, URL, MINT, CARD_DY + 790, al, dy, False)
    return c


def body(t):
    c = blank()
    if t < 10.8:
        c.alpha_composite(SCRIM)
    Y = TEXT_Y

    if t < 3.6:  # S1: words build with the swirl on half-beats
        x = W / 2 - H1.getlength("Drowning in DMs?") / 2
        for wd, at in (("Drowning", 0.6), ("in", 0.9), ("DMs?", 1.2)):
            al, dy = rise(t, at, 3.25, 3.55)
            im, pad, _ = text_layer(wd, H1, PAPER)
            put(c, im, x - pad, Y - pad + dy, al)
            x += H1.getlength(wd + " ")

    elif t < 7.2:  # S2: struck and swapped in time with the step chimes
        al, dy = rise(t, 3.85)
        al *= 1 - prog(t, 5.45, 5.6)
        x0, w = centered(c, "Manual", H1, (201, 209, 220), Y, al, dy)
        sp = ease_out(prog(t, 4.7, 4.95))
        if sp > 0 and al > 0:
            l, top, r, bot = H1.getbbox("Manual")
            ln = blank()
            ym = Y + (bot - top) * 0.56 + dy
            ImageDraw.Draw(ln).line([(x0 - 14, ym), (x0 - 14 + (w + 28) * sp, ym)], fill=CORAL + (255,), width=11)
            put(c, ln, 0, 0, al)
        p = ease_out(prog(t, 5.5, 5.85))
        centered(c, "Automatic.", H1, MINT, Y, p * (1 - prog(t, 6.95, 7.2)), (1 - p) * 28)

    elif t < 10.8:  # S3: "It sends." turns mint as the toggle flips on
        al, dy = rise(t, 7.75, 10.4, 10.6)
        lw, rw = H1.getlength("You approve. "), H1.getlength("It sends.")
        x0 = W / 2 - (lw + rw) / 2
        mix = ease_out(prog(t, TOGGLE_ON - 0.05, TOGGLE_ON + 0.2))
        col = tuple(int(PAPER[i] + (MINT[i] - PAPER[i]) * mix) for i in range(3))
        im, pad, _ = text_layer("You approve.", H1, PAPER)
        put(c, im, x0 - pad, Y - pad + dy, al)
        im, pad, _ = text_layer("It sends.", H1, col)
        put(c, im, x0 + lw - pad, Y - pad + dy, al)

        if 10.3 <= t < 10.8:  # the flow line contracts to centre...
            half = (1 - ease_in(prog(t, 10.3, 10.65))) * 620 + 6
            seg = [(W / 2 - half, LINE_Y), (W / 2 + half, LINE_Y)]
            ln = blank()
            ImageDraw.Draw(ln).line(seg, fill=(170, 200, 255, 255), width=14)
            c.alpha_composite(ln.filter(ImageFilter.GaussianBlur(10)))
            ImageDraw.Draw(c).line(seg, fill=(245, 248, 255, 255), width=4)
        if t >= 10.55:  # ...and the point blooms into light
            b = ease_in(prog(t, 10.55, 10.8))
            c.alpha_composite(light_field(W / 2, LINE_Y, 60 + b * (LIGHT_R - 60), 0.4 + 0.6 * b))

    if t >= 10.8:
        c = end_card(t)
        fade = 1 - ease_out(prog(t, 10.8, 11.25))  # light clears, logo is left glowing
        if fade > 0:
            c.alpha_composite(light_field(W / 2, LINE_Y, LIGHT_R, fade))
    return c


def frame(t):
    if t >= INTRO + 0.2:
        return body(t - INTRO)
    c = blank()  # S1 type starts later, so only the scrim is needed under the intro dissolve
    if t >= INTRO - 0.2:
        sc = SCRIM.copy()
        sc.putalpha(sc.getchannel("A").point(lambda v: int(v * prog(t, INTRO - 0.2, INTRO + 0.2))))
        c.alpha_composite(sc)
    card = intro(t)
    card.putalpha(int(255 * (1 - prog(t, INTRO - 0.2, INTRO + 0.2))))  # dissolve into the chaos
    c.alpha_composite(card)
    return c


os.makedirs(OUT, exist_ok=True)
n = int(DUR * FPS)
for i in range(n):
    frame(i / FPS).save(os.path.join(OUT, f"o_{i:04d}.png"), compress_level=1)
print(f"{FORMAT}: {n} frames {W}x{H}")
