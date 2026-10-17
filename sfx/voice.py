"""Synthetic narration for a timeline's "voice" lines (Kokoro, PT-BR), plus a durations file.

    python3 -m sfx.voice src/aurora/timeline.json public/aurora/voz --model-dir <kokoro dir>

Needs `pip install kokoro-onnx soundfile` and kokoro-v1.0.onnx + voices-v1.0.bin
(github.com/thewh1teagle/kokoro-onnx releases). Writes <out>/<id>.wav and
<out>/durations.json, which the composition reads to time its captions.
"""

import argparse
import json
import os


def main():
    ap = argparse.ArgumentParser(prog="python3 -m sfx.voice")
    ap.add_argument("timeline")
    ap.add_argument("out")
    ap.add_argument("--model-dir", default=os.environ.get("KOKORO_DIR", "."))
    ap.add_argument("--voice", default="pf_dora")
    ap.add_argument("--speed", type=float, default=0.95)
    args = ap.parse_args()

    import soundfile as sf
    from kokoro_onnx import Kokoro

    kokoro = Kokoro(os.path.join(args.model_dir, "kokoro-v1.0.onnx"), os.path.join(args.model_dir, "voices-v1.0.bin"))
    with open(args.timeline) as f:
        tl = json.load(f)
    os.makedirs(args.out, exist_ok=True)
    durations = {}
    for line in tl["voice"]:
        samples, sr = kokoro.create(line["say"], voice=args.voice, speed=args.speed, lang="pt-br")
        sf.write(os.path.join(args.out, f"{line['id']}.wav"), samples, sr)
        durations[line["id"]] = round(len(samples) / sr, 3)
        print(f"{line['id']}: {durations[line['id']]:.2f}s")
    with open(os.path.join(args.out, "durations.json"), "w") as f:
        json.dump(durations, f, indent=2)


if __name__ == "__main__":
    main()
