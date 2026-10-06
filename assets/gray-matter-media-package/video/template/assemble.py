"""Composite a promo's clips, overlay frames and audio mix into the final MP4.

    python3 assemble.py <promo_dir> <square|vertical> <overlay_dir> <mix.wav> <out.mp4>

Clip i is <promo_dir>/clips/s<i>.mp4, one per scene in promo.json. The first clip starts
under the intro card's dissolve; neighbouring clips cross-dissolve for 0.4s centred on
each scene boundary (no hard cuts); the last clip's final frame holds under the end card.
"""
import json
import os
import subprocess
import sys

promo, fmt, ov, aud, out = sys.argv[1:6]
cfg = json.load(open(os.path.join(promo, "promo.json")))
intro = cfg["intro"]["duration"]
durs = [s["duration"] for s in cfg["scenes"]]
total = round(intro + sum(durs) + cfg["end_card"]["duration"], 3)
n = len(durs)
footage_y = cfg.get("vertical_footage_y", 420)


def clip(i, length):
    head = f"[{i}:v]trim=0:{length:g},setpts=PTS-STARTPTS"
    if fmt == "vertical":  # square footage at y=footage_y with soft edges over a blurred, darkened fill
        return (f"{head},fps=24,split[f{i}][b{i}];"
                f"[b{i}]scale=1920:1920:flags=bicubic,crop=1080:1920,boxblur=40:2,eq=brightness=-0.12:saturation=0.85[g{i}];"
                f"[f{i}]scale=1080:1080:flags=lanczos,format=rgba,"
                f"geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(Y,1079-Y)/70)'[m{i}];"
                f"[g{i}][m{i}]overlay=0:{footage_y},setsar=1,format=yuv420p")
    return f"{head},scale=1080:1080:flags=lanczos,setsar=1,fps=24,format=yuv420p"


parts, prev, t = [], None, intro
for i, d in enumerate(durs):
    length = round(d + (0.2 if i == n - 1 else 0.4), 3)
    chain = clip(i, length)
    if i == 0:
        chain += f",tpad=start_mode=clone:start_duration={intro - 0.2:g}"
    parts.append(f"{chain}[c{i}]")
    if prev is None:
        prev = f"c{i}"
    else:
        parts.append(f"[{prev}][c{i}]xfade=transition=fade:duration=0.4:offset={round(t - 0.2, 3):g}[x{i}]")
        prev = f"x{i}"
    t += d
parts.append(f"[{prev}]tpad=stop_mode=clone:stop_duration={cfg['end_card']['duration']:g}[base]")
parts.append(f"[base][{n}:v]overlay=0:0:format=auto,format=yuv420p,trim=0:{total:g}[v]")

cmd = ["ffmpeg", "-y", "-v", "error"]
for i in range(n):
    cmd += ["-i", os.path.join(promo, "clips", f"s{i + 1}.mp4")]
cmd += ["-framerate", "24", "-i", os.path.join(ov, "o_%04d.png"), "-i", aud,
        "-filter_complex", ";".join(parts), "-map", "[v]", "-map", f"{n + 1}:a", "-t", f"{total:g}",
        "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out]
subprocess.run(cmd, check=True)
subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,width,height",
                "-of", "compact", out], check=True)
