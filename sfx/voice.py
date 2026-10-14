"""Narration: speak a narration JSON offline and write a voice WAV plus caption timings.

    SHERPA_TTS_DIR=<models> python3 -m sfx.voice src/<video>/narration.json public/<video>/voz.wav src/<video>/voice.json

Needs `pip install sherpa-onnx soundfile` and a Kokoro or Piper model from the
sherpa-onnx tts-models release (kokoro-multi-lang-v1_0, vits-piper-pt_BR-*) in
SHERPA_TTS_DIR. `voice` in the JSON picks it: "kokoro:pf_dora", "piper:faber".

Each scene has `lines` (sentences); each line is a list of caption chunks, spoken
as one sentence so the intonation stays natural. Chunk times come from the
length of each chunk, snapped to the nearest pause in the audio. `say` maps
written words to how the voice should pronounce them; captions keep the spelling.
"""

import json
import math
import os
import re
import sys

KOKORO_IDS = {"pf_dora": 42, "pm_alex": 43, "pm_santa": 44}
SR = 48000
GAP = 0.32  # between sentences of one scene


def engine(voice):
    import sherpa_onnx as so

    root = os.environ.get("SHERPA_TTS_DIR", ".")
    kind, name = voice.split(":")
    if kind == "kokoro":
        d = f"{root}/kokoro-multi-lang-v1_0"
        cfg = so.OfflineTtsModelConfig(
            kokoro=so.OfflineTtsKokoroModelConfig(
                model=f"{d}/model.onnx", voices=f"{d}/voices.bin", tokens=f"{d}/tokens.txt",
                data_dir=f"{d}/espeak-ng-data", lexicon=f"{d}/lexicon-us-en.txt", lang="pt-br"),
            num_threads=4)
        return so.OfflineTts(so.OfflineTtsConfig(model=cfg)), KOKORO_IDS[name]
    d = f"{root}/vits-piper-pt_BR-{name}-medium"
    cfg = so.OfflineTtsModelConfig(
        vits=so.OfflineTtsVitsModelConfig(
            model=f"{d}/pt_BR-{name}-medium.onnx", tokens=f"{d}/tokens.txt", data_dir=f"{d}/espeak-ng-data"),
        num_threads=4)
    return so.OfflineTts(so.OfflineTtsConfig(model=cfg)), 0


def resample(x, sr):
    import numpy as np

    n = int(len(x) * SR / sr)
    return np.interp(np.arange(n) * sr / SR, np.arange(len(x)), x).astype("float32")


def frames_rms(x, hop=480):
    import numpy as np

    n = len(x) // hop
    return np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(axis=1) + 1e-12)


def trim(x):
    r = frames_rms(x)
    on = r > r.max() * 0.03
    idx = [i for i, v in enumerate(on) if v]
    a, b = max(0, idx[0] - 2), min(len(r), idx[-1] + 4)
    return x[a * 480 : b * 480]


def pauses(x):
    """Midpoints (s) of quiet stretches of at least 70 ms inside speech."""
    r = frames_rms(x)
    quiet = r < r.max() * 0.04
    out, run = [], 0
    for i, q in enumerate(quiet):
        if q:
            run += 1
        else:
            if run >= 7:
                out.append((i - run / 2) * 0.01)
            run = 0
    return out


def spoken(text, say):
    for w, s in say.items():
        text = re.sub(rf"\b{re.escape(w)}\b", s, text)
    return text


def main(src, wav_out, json_out):
    import numpy as np
    import soundfile as sf

    nar = json.load(open(src))
    tts, sid = engine(nar["voice"])
    say = nar.get("say", {})
    t = 0.0
    parts, scenes = [], {}
    for sc in nar["scenes"]:
        start = t
        t += sc.get("lead", 0.8)
        caps = []
        for li, chunks in enumerate(sc["lines"]):
            text = " ".join(chunks)
            a = tts.generate(spoken(text, say), sid=sid, speed=nar.get("speed", 1.0))
            x = trim(resample(np.array(a.samples, dtype="float32"), a.sample_rate))
            dur = len(x) / SR
            weights = [len(c) + 6 for c in chunks]
            total = sum(weights)
            ps = pauses(x)
            bounds, acc = [0.0], 0
            for w in weights[:-1]:
                acc += w
                est = dur * acc / total
                near = [p for p in ps if abs(p - est) < 0.7]
                bounds.append(min(near, key=lambda p: abs(p - est)) if near else est)
            bounds.append(dur)
            for c, b0, b1 in zip(chunks, bounds, bounds[1:]):
                caps.append({"text": c, "t0": round(t + b0, 3), "t1": round(t + b1, 3)})
            parts.append((t, x))
            t += dur + (GAP if li < len(sc["lines"]) - 1 else 0)
        voice_end = t
        t += sc.get("tail", 0.5)
        scenes[sc["id"]] = {"start": round(start, 3), "voice": caps[0]["t0"], "voiceEnd": round(voice_end, 3),
                            "end": round(t, 3), "captions": caps}
        print(f"{sc['id']}: {start:6.2f} → {t:6.2f}  ({len(caps)} legendas)")
    out = np.zeros(int(t * SR) + SR, dtype="float32")
    for t0, x in parts:
        i = int(t0 * SR)
        out[i : i + len(x)] += x
    sf.write(wav_out, out, SR, subtype="PCM_16")
    json.dump({"duration": round(t, 3), "scenes": scenes}, open(json_out, "w"), ensure_ascii=False, indent=1)
    print(f"total {t:.2f} s → {wav_out}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
