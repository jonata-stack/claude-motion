"""Sound for AuroraTocantins: calm instrumental bed (original, generated here) ducked under the narration.

    python3 -m sfx.voice src/aurora/timeline.json public/aurora/voz   # narration first
    python3 -m sfx sfx/cues/aurora.py
"""

import json
import math
import struct
import wave

from sfx import dsp
from sfx.synth import SR, blip, envelope, pad

TIMELINE = "src/aurora/timeline.json"
OUT = "public/aurora/aurora.wav"
TARGET_LUFS = -14.0
VOICE_DIR = "public/aurora/voz"

# D major, one chord every 7.5 s: D(add9), Bm7, Gmaj7, Asus4, ..., ends on D.
D9 = [146.83, 220.0, 293.66, 329.63, 369.99]
BM7 = [123.47, 185.0, 220.0, 293.66, 369.99]
GM7 = [98.0, 146.83, 246.94, 293.66, 369.99]
ASUS = [110.0, 164.81, 220.0, 293.66, 329.63]
PROG = [D9, BM7, GM7, ASUS]
BAR = 7.5
# Soft plucked notes over the bed, pentatonic so nothing clashes with the voice.
PLUCK = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66]


def rand_note(i, n):
    x = math.sin(i * 91.7 + 13.1) * 43758.5453
    return int((x - math.floor(x)) * n)


def read_wav(path):
    """16-bit WAV to mono floats at SR (linear resample)."""
    with wave.open(path) as wf:
        sr, ch, n = wf.getframerate(), wf.getnchannels(), wf.getnframes()
        vals = struct.unpack(f"<{n * ch}h", wf.readframes(n))
    x = [v / 32768 for v in vals[::ch]]
    if sr == SR:
        return x
    k = sr / SR
    m = int(len(x) / k)
    return [x[min(int(i * k), len(x) - 2)] * (1 - (i * k) % 1) + x[min(int(i * k) + 1, len(x) - 1)] * ((i * k) % 1) for i in range(m)]


def score(mix, tl):
    dur = tl["duration"]
    with open(f"{VOICE_DIR}/durations.json") as f:
        lengths = json.load(f)

    # music dips to 40% under each line, back up in the gaps
    pts = [(0, 0), (1.5, 1), (dur - 3.0, 1), (dur, 0)]
    for line in tl["voice"]:
        t0 = tl[line["scene"]]["voice"]
        t1 = t0 + lengths[line["id"]]
        pts += [(t0 - 0.35, 1), (t0, 0.4), (t1, 0.4), (t1 + 0.6, 1)]
    pts.sort()
    merged = []
    for p in pts:  # overlapping duck windows: keep the lower value
        if merged and abs(merged[-1][0] - p[0]) < 1e-6:
            merged[-1] = (p[0], min(merged[-1][1], p[1]))
        else:
            merged.append(p)
    volume = envelope(merged)

    chords = [(i * BAR, PROG[i % 4]) for i in range(int(dur // BAR))] + [(dur - BAR + 0.5, D9)]
    mix.put_stereo(0, *pad(dur, chords, volume=volume, detune=0.8, tremolo=0.12, xfade=2.2), gain=0.075)

    plucks = dsp.zeros(int(dur * SR))
    t = 1.2
    i = 0
    while t < dur - 3:
        note = PLUCK[rand_note(i, len(PLUCK))]
        dsp.add(plucks, blip(note, dur=2.0, tau=0.55), int(t * SR), 0.5 * volume(t))
        t += [1.25, 0.6, 1.9, 1.25][i % 4]
        i += 1
    wl, wr = dsp.reverb(plucks, size=0.8, damp=0.5, scale=1.3)
    mix.put_stereo(0, [p * 0.5 + w for p, w in zip(plucks, wl)], [p * 0.5 + w for p, w in zip(plucks, wr)], gain=0.07)

    # level the voice so its peaks don't force the master to saturate everything
    for line in tl["voice"]:
        v = read_wav(f"{VOICE_DIR}/{line['id']}.wav")
        v = dsp.scaled(v, 1 / dsp.peak(v))
        v, _ = dsp.compress(v, v, thresh_db=-22, ratio=3.0, attack=0.004, release=0.12)
        v = dsp.softclip(dsp.scaled(v, 1.6 / dsp.peak(v)), drive=1.6)
        mix.put(tl[line["scene"]]["voice"], v, 0.9)
