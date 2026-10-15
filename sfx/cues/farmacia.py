"""Music bed and accents for FarmaciaApresentacao. Every time comes from src/farmacia/voice.json.

    python3 -m sfx sfx/cues/farmacia.py

This renders only the instrumental (pad, soft piano arpeggio, light pulse, a few
accents). The narration is mixed on top, with the bed ducked under the voice,
by `npm run farmacia:mix`.
"""

import math
import random

from sfx.synth import SR, blip, chime, envelope, pad, pop, whoosh

TIMELINE = "src/farmacia/voice.json"
OUT = "public/farmacia/trilha.wav"
TARGET_LUFS = -16.0

BPM = 84
BEAT = 60 / BPM
BAR = 4 * BEAT

# D major, warm and unhurried: Dmaj9 – Bm7 – Gmaj9 – Asus4, one chord per bar.
NOTE = lambda m: 440.0 * 2 ** ((m - 69) / 12)
CHORDS = [
    [50, 57, 61, 64, 66],  # Dmaj9 (D A C# E F#)
    [47, 54, 57, 62, 66],  # Bm7 (B F# A D F#)
    [43, 50, 54, 57, 62],  # Gmaj9-ish (G D F# A D)
    [45, 52, 55, 62, 64],  # Asus4 (A E G D E)
]
ARP = [0, 2, 3, 4, 3, 2, 1, 2]  # indices into the chord, eighth notes


def keys(freq, dur=1.6, tau=0.55, bright=0.35):
    """Felt-piano pluck: a few decaying partials, soft attack."""
    n = int(dur * SR)
    att = int(0.006 * SR)
    w = 2 * math.pi * freq / SR
    out = []
    for i in range(n):
        e = math.exp(-i / (tau * SR)) * (i / att if i < att else 1.0)
        e2 = math.exp(-i / (tau * 0.35 * SR))
        out.append(e * (math.sin(w * i) + bright * e2 * math.sin(2 * w * i) + 0.12 * e2 * math.sin(3 * w * i)))
    return out


def kick():
    """Soft low thump, felt more than heard."""
    n = int(0.35 * SR)
    out, ph = [], 0.0
    for i in range(n):
        t = i / SR
        ph += 2 * math.pi * (48 + 60 * math.exp(-t * 30)) / SR
        out.append(math.sin(ph) * math.exp(-t * 11))
    return out


def shaker():
    n = int(0.07 * SR)
    return [random.uniform(-1, 1) * math.exp(-i / (0.012 * SR)) for i in range(n)]


def score(mix, tl):
    sc = tl["scenes"]
    dur = tl["duration"]
    put = mix.put

    bars = int(dur / BAR) + 1
    chords = [(b * BAR, [NOTE(m) for m in CHORDS[b % 4]]) for b in range(bars)]

    groove_in = sc["s3"]["start"]
    groove_out = sc["s10"]["start"] + 1.0
    end = sc["s10"]["captions"][11]["t0"] - 0.4

    vol = envelope([(0, 0.0), (1.2, 1.0), (end, 1.0), (end + 0.6, 1.25), (dur - 1.5, 1.25), (dur, 0.0)])
    mix.put_stereo(0, *pad(dur, chords, volume=vol, detune=0.5, tremolo=0.18), gain=0.05)

    # Piano arpeggio, eighth notes; thinner in the intro and the ending, fuller under the plans.
    for b in range(bars):
        t_bar = b * BAR
        if t_bar > dur - BAR:
            break
        chord = CHORDS[b % 4]
        for k, idx in enumerate(ARP):
            t = t_bar + k * BEAT / 2
            if t < 0.3 or t > dur - 1.5:
                continue
            sparse = t < groove_in or t > groove_out
            if sparse and k % 2:
                continue
            note = NOTE(chord[idx] + 12)
            g = (0.05 if k % 2 else 0.065) * (0.8 + 0.2 * random.random())
            put(t, keys(note, dur=1.4), g, pan=-0.35 + 0.1 * idx)
        put(t_bar, keys(NOTE(chord[0]), dur=2.6, tau=1.2, bright=0.15), 0.06, -0.1)

    # Light pulse while the offer is explained.
    for b in range(bars):
        for beat in range(4):
            t = b * BAR + beat * BEAT
            if groove_in + BAR <= t <= groove_out - BEAT:
                if beat in (0, 2):
                    put(t, kick(), 0.09)
                put(t + BEAT / 2, shaker(), 0.012, 0.3)

    # Scene changes: a soft air move, no more.
    for i, key in enumerate(["s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10"]):
        put(sc[key]["start"] - 0.15, whoosh(0.55, 400, 2400, peak=0.55), 0.05, -0.4 + 0.1 * i)

    # Prices land with a note in key; the end card resolves.
    for key in ["s6", "s7"]:
        cap = sc[key]["captions"][1 if key == "s6" else 1]
        put(cap["t0"] - 0.2, blip(NOTE(81), dur=0.5, tau=0.16), 0.06)
    for i, c in enumerate(sc["s9"]["captions"][:2]):
        put(c["t0"] - 0.1, pop(700 + 150 * i, 400), 0.04, -0.2 + 0.4 * i)
    put(end + 0.2, chime([NOTE(74), NOTE(78), NOTE(81), NOTE(86)], dur=2.6, tau=1.0), 0.07)
