"""Synthesise the sound design: one bell as the intro title lands, layering notification
pings (S1), a rising tone + one chime per flow step (S2), a toggle click (S3).

    python3 sfx.py <out.wav> <intro_seconds>

Body event times are measured from the end of the intro, like build_overlay.py."""
import sys, wave
import numpy as np
SR = 44100
OFF = float(sys.argv[2]) if len(sys.argv) > 2 else 3.6  # intro length; body events shift by this
DUR = 16.8 + OFF
out = np.zeros((int(SR * DUR), 2))
rng = np.random.default_rng(7)

def add(sig, t, pan=0.0, gain=1.0, shift=True):
    i = int((t + (OFF if shift else 0)) * SR); sig = sig[: len(out) - i] * gain
    out[i:i + len(sig), 0] += sig * np.sqrt((1 - pan) / 2)
    out[i:i + len(sig), 1] += sig * np.sqrt((1 + pan) / 2)

def env(n, att, dec):
    tt = np.arange(n) / SR
    return np.minimum(tt / att, 1) * np.exp(-tt / dec)

def ping(f):  # soft two-note notification blip
    n = int(0.35 * SR); tt = np.arange(n) / SR
    a = np.sin(2 * np.pi * f * tt) * env(n, 0.004, 0.06)
    b = np.zeros(n); k = int(0.07 * SR)
    b[k:] = np.sin(2 * np.pi * f * 1.335 * tt[: n - k]) * env(n - k, 0.004, 0.08)
    return (a + b) * 0.5

def bell(f, dec=0.6):
    n = int(1.6 * SR); tt = np.arange(n) / SR
    s = sum(w * np.sin(2 * np.pi * f * m * tt) * np.exp(-tt / (dec / m ** 0.5))
            for m, w in ((1, 1), (2.0, 0.35), (2.76, 0.25), (5.4, 0.08)))
    return s * np.minimum(tt / 0.003, 1) * 0.45

# S1: pings layering up as the swirl builds, gone before the hang
times = [0.35, 0.95, 1.3, 1.65, 1.9, 2.15, 2.35, 2.55, 2.7, 2.85]
for i, t in enumerate(times):
    add(ping(rng.choice([1174.7, 1318.5, 1568.0, 1760.0])), t, pan=rng.uniform(-0.7, 0.7), gain=0.10 + 0.012 * i)

# S2: rising tone as the line forms, then a chime per completed step (ascending)
n = int(0.9 * SR); tt = np.arange(n) / SR
f = 220 * (4 ** (tt / 0.9)); ph = 2 * np.pi * np.cumsum(f) / SR
add(np.sin(ph) * (tt / 0.9) ** 2 * np.exp(-np.maximum(tt - 0.8, 0) / 0.03) * 0.09, 3.1)
for t, fr in zip((3.95, 4.7, 5.5, 6.45), (1046.5, 1318.5, 1568.0, 2093.0)):
    add(bell(fr), t, gain=0.16)

# S3: toggle click + small confirmation chime
n = int(0.03 * SR); click = rng.standard_normal(n) * env(n, 0.0005, 0.004)
click = np.convolve(click, np.ones(4) / 4, "same")
add(click, 10.08, gain=0.35)
add(bell(1567.98, 0.4), 10.1, gain=0.12)

if OFF:  # intro: one soft, low bell as the title lands
    add(bell(523.25, 0.9) + bell(783.99, 0.9) * 0.5, 1.2, gain=0.12, shift=False)

pk = np.abs(out).max(); print("sfx peak", round(pk, 3))
w = wave.open(sys.argv[1], "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(out, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
