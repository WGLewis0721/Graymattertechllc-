"""Synthesise a promo's sound effects from the "sfx" list in promo.json.

    python3 sfx.py <promo_dir> <out.wav>

Event kinds (times on the music grid, measured from the end of the intro unless
"intro": true):
  pings    soft notification blips layering up       {"times": [...]}
  crackle  short electrical crackles                   {"times": [...]}
  riser    rising tone, 0.9s                           {"t"}
  chime    bell                                        {"t", "f", "decay"?, "gain"?}
  click    switch click                                {"t"}
  bell     intro title bell (two notes)                {"t", "intro": true}
"""
import json
import os
import sys
import wave

import numpy as np

PROMO, OUT = sys.argv[1], sys.argv[2]
cfg = json.load(open(os.path.join(PROMO, "promo.json")))
SR = 44100
OFF = cfg["intro"]["duration"]
DUR = OFF + sum(s["duration"] for s in cfg["scenes"]) + cfg["end_card"]["duration"]
out = np.zeros((int(SR * DUR), 2))
rng = np.random.default_rng(7)


def add(sig, t, pan=0.0, gain=1.0, shift=True):
    i = int((t + (OFF if shift else 0)) * SR)
    sig = sig[: len(out) - i] * gain
    out[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2)
    out[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2)


def env(n, att, dec):
    tt = np.arange(n) / SR
    return np.minimum(tt / att, 1) * np.exp(-tt / dec)


def ping(f):  # soft two-note notification blip
    n = int(0.35 * SR)
    tt = np.arange(n) / SR
    a = np.sin(2 * np.pi * f * tt) * env(n, 0.004, 0.06)
    b = np.zeros(n)
    k = int(0.07 * SR)
    b[k:] = np.sin(2 * np.pi * f * 1.335 * tt[: n - k]) * env(n - k, 0.004, 0.08)
    return (a + b) * 0.5


def bell(f, dec=0.6):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    s = sum(w * np.sin(2 * np.pi * f * m * tt) * np.exp(-tt / (dec / m ** 0.5))
            for m, w in ((1, 1), (2.0, 0.35), (2.76, 0.25), (5.4, 0.08)))
    return s * np.minimum(tt / 0.003, 1) * 0.45


def riser():
    n = int(0.9 * SR)
    tt = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(220 * (4 ** (tt / 0.9))) / SR
    return np.sin(ph) * (tt / 0.9) ** 2 * np.exp(-np.maximum(tt - 0.8, 0) / 0.03) * 0.09


def crackle():  # a few band-limited sparks over ~0.25s
    n = int(0.25 * SR)
    s = np.zeros(n)
    for _ in range(6):
        k, m = rng.integers(0, n - 400), rng.integers(60, 300)
        s[k:k + m] += rng.standard_normal(m) * env(m, 0.0003, 0.002)
    return np.convolve(s, np.ones(3) / 3, "same") * 0.5


for ev in cfg["sfx"]:
    kind = ev["kind"]
    if kind == "pings":
        for i, t in enumerate(ev["times"]):
            add(ping(rng.choice([1174.7, 1318.5, 1568.0, 1760.0])), t, pan=rng.uniform(-0.7, 0.7), gain=0.10 + 0.012 * i)
    elif kind == "crackle":
        for t in ev["times"]:
            add(crackle(), t, pan=rng.uniform(-0.5, 0.5), gain=ev.get("gain", 0.25))
    elif kind == "riser":
        add(riser(), ev["t"])
    elif kind == "chime":
        add(bell(ev["f"], ev.get("decay", 0.6)), ev["t"], gain=ev.get("gain", 0.16))
    elif kind == "click":
        n = int(0.03 * SR)
        click = np.convolve(rng.standard_normal(n) * env(n, 0.0005, 0.004), np.ones(4) / 4, "same")
        add(click, ev["t"], gain=0.35)
    elif kind == "bell":
        add(bell(523.25, 0.9) + bell(783.99, 0.9) * 0.5, ev["t"], gain=0.12, shift=not ev.get("intro"))

print("sfx peak", round(float(np.abs(out).max()), 3))
w = wave.open(OUT, "wb")
w.setnchannels(2)
w.setsampwidth(2)
w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes())
w.close()
