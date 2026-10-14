"""Sound design for DunaAcai. Every time comes from src/duna/timeline.json.

    python3 -m sfx sfx/cues/duna_acai.py
"""

from sfx.synth import blip, chime, click, envelope, impact, pad, pop, riser, whoosh

TIMELINE = "src/duna/timeline.json"
OUT = "public/duna-acai.wav"
TARGET_LUFS = -14.0

# F major, bright and sweet: Fmaj9 for the build-up, Bb(add9) on the logo.
BED_A = [174.61, 220.0, 261.63, 329.63, 392.0]
BED_B = [116.54, 174.61, 233.08, 293.66, 523.25]
CHIP_NOTES = [523.25, 587.33, 698.46, 783.99, 880.0]


def score(mix, tl):
    s1, s2, s3 = tl["s1"], tl["s2"], tl["s3"]
    dur = tl["duration"]
    put = mix.put

    hit = s3["irisEnd"]
    volume = envelope([
        (0, 0.4), (0.8, 1), (s3["iris"], 1), (s3["iris"] + 0.2, 0.4),
        (hit, 0.4), (hit + 0.4, 1.2), (dur - 0.8, 1.2), (dur, 0),
    ])
    mix.put_stereo(0, *pad(dur, [(0, BED_A), (hit, BED_B)], volume=volume), gain=0.03)

    # scene 1: "Deu vontade?"
    for i, w in enumerate([s1["deu"], s1["vontade"]]):
        put(w, whoosh(0.32, 500, 2600, peak=0.45), 0.12, -0.3 + i * 0.6)
        put(w + 0.14, blip(87.3 if i == 0 else 110.0, dur=0.35, tau=0.09), 0.24)
    put(s1["swoosh"], whoosh(0.5, 1200, 5000, peak=0.3, q=0.6), 0.08, 0.3)
    put(s1["exit"], whoosh(0.42, 600, 3200, peak=0.4), 0.16)

    # scene 2: the card becomes the bowl, toppings get picked
    put(s2["morph"], whoosh(s2["morphEnd"] - s2["morph"], 300, 1800, peak=0.5), 0.14)
    for i, ln in enumerate(s2["title"]):
        put(ln + 0.12, blip(98.0 if i == 0 else 130.81, dur=0.3, tau=0.08), 0.2)
    pans = [-0.5, 0.5, -0.45, 0.45, 0.0]
    for i, c in enumerate(s2["chips"]):
        put(c, pop(900 + i * 120, 420 + i * 60), 0.2, pans[i])
        tap = c + s2["tapDelay"]
        put(tap, click(2200), 0.22, pans[i])
        put(tap + 0.01, blip(CHIP_NOTES[i], dur=0.45, tau=0.13), 0.16, pans[i])
    put(s2["chips"][-1] + s2["tapDelay"] + 0.15, chime([698.46, 880.0, 1046.5], dur=1.6, tau=0.6), 0.12)
    for i in range(5):
        put(s2["exit"] + 0.3 + i * 0.05, pop(1400 - i * 120, 500), 0.08, pans[i])

    # iris into the logo: the one impact
    put(s3["iris"] - 0.05, riser(hit - s3["iris"] + 0.05, 300, 4500), 0.2)
    put(hit - 0.01, impact(), 0.32)
    put(hit, chime([698.46, 880.0, 1046.5, 1396.9], dur=2.2, tau=0.8), 0.14)
    put(s3["acai"], whoosh(0.4, 800, 3000, peak=0.4), 0.08)
    put(s3["cta"], pop(700, 350), 0.2)
    put(s3["handle"], pop(1200, 700), 0.06, 0.3)
    put(s3["tap"], click(1800), 0.26)
    put(s3["tap"] + 0.02, blip(1046.5, dur=0.5, tau=0.15), 0.14)
