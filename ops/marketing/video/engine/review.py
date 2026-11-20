#!/usr/bin/env python3
"""Review a rendered Reel before it goes anywhere.

Probes the encoded file, pulls frames (every second, plus just before, during and after every
scene change, where a broken transition hides), builds a contact sheet and a phone-size strip,
and writes a review report listing exactly which timestamps were inspected.

  python3 ops/marketing/video/engine/review.py out/gm-fb-0001-9x16.mp4
  (reads out/gm-fb-0001.spec.json, written next to the video by reel.js)

The checks it can do are done here. The ones it cannot are listed as "human" and stay
unchecked until a person has watched the video with the sound on.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw


def sh(*cmd):
    return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    mp4 = Path(sys.argv[1]).resolve()
    stem = mp4.stem                                   # gm-fb-0001-9x16
    post, fmt = stem.rsplit("-", 1)
    spec = json.loads((mp4.parent / f"{post}.spec.json").read_text())
    want_w, want_h = spec["formats"][fmt]

    probe = json.loads(sh("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(mp4)))
    v = next(s for s in probe["streams"] if s["codec_type"] == "video")
    audio = [s for s in probe["streams"] if s["codec_type"] == "audio"]
    dur = float(probe["format"]["duration"])
    num, den = (int(x) for x in v["r_frame_rate"].split("/"))
    checks = {
        "codec is h264": v["codec_name"] == "h264",
        "pixel format is yuv420p (plays everywhere)": v["pix_fmt"] == "yuv420p",
        f"size is {want_w}x{want_h}": (v["width"], v["height"]) == (want_w, want_h),
        f"frame rate is {spec['fps']}": num / den == spec["fps"],
        f"duration is {spec['duration']}s (±0.1)": abs(dur - spec["duration"]) <= 0.1,
        "has an audio track (some platforms reject none)": bool(audio),
        "file is under 100 MB": mp4.stat().st_size < 100_000_000,
    }

    edges = [s["start"] for s in spec["scenes"][1:]]
    times = sorted({round(t, 2) for t in
                    [x for x in range(int(dur) + 1)]
                    + [e + d for e in edges for d in (-0.2, -0.05, 0.05, 0.2, 0.5)]
                    + [0, 0.1, dur - 0.1] if 0 <= t < dur})
    tmp = Path(tempfile.mkdtemp())
    frames = []
    for t in times:
        out = tmp / f"f{t:07.2f}.png"
        sh("ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", str(mp4), "-frames:v", "1", str(out))
        frames.append((t, Image.open(out).convert("RGB")))

    def sheet(items, thumb_w, cols, label=True):
        h = int(thumb_w * items[0][1].height / items[0][1].width)
        rows = (len(items) + cols - 1) // cols
        im = Image.new("RGB", (cols * (thumb_w + 8) + 8, rows * (h + 8 + (16 if label else 0)) + 8), "#777")
        d = ImageDraw.Draw(im)
        for i, (t, f) in enumerate(items):
            x, y = 8 + (i % cols) * (thumb_w + 8), 8 + (i // cols) * (h + 8 + (16 if label else 0))
            im.paste(f.resize((thumb_w, h)), (x, y + (16 if label else 0)))
            if label:
                near = any(abs(t - e) <= 0.5 for e in edges)
                d.text((x, y + 2), f"{t:.2f}s{'  <- scene change' if near else ''}", fill="#fff")
        return im

    contact = mp4.with_suffix(".contact.png"); sheet(frames, 200, 8).save(contact)
    key = [min(frames, key=lambda f: abs(f[0] - t)) for t in
           (0.1, spec["scenes"][0]["end"] - 0.5, spec["scenes"][1]["end"] - 0.5, dur - 0.1)]
    phone = mp4.with_suffix(".phone.png"); sheet(key, 280, 4, label=False).save(phone)   # about the size people watch at

    report = {
        "file": mp4.name, "post": post, "format": fmt, "checks": checks,
        "timestamps_inspected": times, "contact_sheet": contact.name, "phone_size_strip": phone.name,
        "human": {
            "watched start to finish with sound on": None,
            "text readable on a real phone, no part under the app's buttons": None,
            "scene changes feel clean, nothing jumps or overlaps": None,
            "every word matches the approved post and service wording": None,
            "issues_found": [], "fixes_applied": [], "remaining_concerns": [],
        },
    }
    rp = mp4.with_suffix(".review.json"); rp.write_text(json.dumps(report, indent=2) + "\n")
    bad = [k for k, ok in checks.items() if not ok]
    print(f"{mp4.name}: {len(times)} timestamps inspected -> {contact.name}, {phone.name}")
    for k, ok in checks.items():
        print(("  ok   " if ok else "  FAIL ") + k)
    print(f"  report: {rp.name} (the 'human' items stay null until someone watches it)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
