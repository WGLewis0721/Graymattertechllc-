"""Trim and slowly push in on a generated clip, at sub-pixel precision (no zoompan jitter).

    python3 reframe_clip.py <in.mp4> <out.mp4> --head 1.0 --length 6.2 \
        --to-scale 1.3 --x0 0 --y0 110 --reach 3.8 [--drift 0.04]

Starts full frame (so it dissolves cleanly from the previous clip's last frame) and eases
to a crop of 1080/to-scale px whose top-left corner is (x0, y0) in 1080-px coordinates,
arriving at --reach seconds. After that the scale keeps creeping by --drift until the end.
If the source runs out before --length, its last frame is held while the push continues.
Use it to frame out something a model added that the promo can't use.
"""
import argparse
import subprocess

import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src"), ap.add_argument("out")
for k, v in (("head", 0.0), ("length", 6.2), ("to-scale", 1.3), ("x0", 0.0), ("y0", 0.0), ("reach", 3.8), ("drift", 0.0)):
    ap.add_argument(f"--{k}", type=float, default=v)
a = ap.parse_args()

probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                        "-of", "csv=p=0", a.src], capture_output=True, text=True, check=True).stdout.strip().split(",")
SW, SH = int(probe[0]), int(probe[1])
raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{a.head}", "-i", a.src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, SH, SW, 3)
FPS, n = 24, round(a.length * 24)
k = SW / 1080.0  # crop parameters are given in 1080-px coordinates

enc = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{SW}x{SH}", "-r", "24",
                        "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", a.out],
                       stdin=subprocess.PIPE)
for i in range(n):
    t = i / FPS
    p = min(t / a.reach, 1.0)
    p = p * p * (3 - 2 * p)  # smoothstep
    s = 1 + (a.to_scale - 1) * p + a.drift * max(t - a.reach, 0) / max(a.length - a.reach, 1e-6)
    x0, y0 = a.x0 * p * k, a.y0 * p * k
    w = SW / s
    src = Image.fromarray(frames[min(i, len(frames) - 1)])
    # affine map from output pixel to source pixel: x_src = x0 + x_out * w / SW
    img = src.transform((SW, SH), Image.AFFINE, (w / SW, 0, x0, 0, w / SW, y0), resample=Image.BICUBIC)
    enc.stdin.write(img.tobytes())
enc.stdin.close()
enc.wait()
print(f"{a.out}: {n} frames, {len(frames)} source frames after {a.head}s head trim")
