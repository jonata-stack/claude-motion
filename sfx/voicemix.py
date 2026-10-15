"""Mix narration over a music bed: duck the bed under the voice, then master to -14 LUFS.

    python3 -m sfx.voicemix <voice.wav> <bed.wav> <out.wav> [bed_db]

The bed sits `bed_db` (default -17) under its own level and is pressed down a
further few dB by a sidechain on the voice, so words stay in front without the
music pumping. A little low-mid warmth, presence and de-essing take the edge off
the synthetic voice. Two-pass loudnorm hits -14 LUFS integrated, -1.5 dBTP.
"""

import json
import re
import subprocess
import sys


def run(args):
    return subprocess.run(["ffmpeg", "-hide_banner", "-y", *args], capture_output=True, text=True)


def main(voice, bed, out, bed_db="-17"):
    graph = (
        f"[1:a]volume={bed_db}dB[bed];"
        "[0:a]aformat=channel_layouts=stereo,highpass=f=80,equalizer=f=180:t=q:w=1:g=1.5,equalizer=f=3200:t=q:w=1.4:g=1.5,deesser=i=0.35,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2[v];"
        "[v]asplit=2[vk][vm];"
        "[bed][vk]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=450[duck];"
        "[vm][duck]amix=inputs=2:normalize=0:duration=longest[mix]"
    )
    tmp = out.replace(".wav", "-pre.wav")
    r = run(["-i", voice, "-i", bed, "-filter_complex", graph, "-map", "[mix]", "-ar", "48000", tmp])
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    r = run(["-i", tmp, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"])
    m = json.loads(re.search(r"\{[^{}]*\}", r.stderr[r.stderr.rfind("{") - 1 :]).group(0))
    af = (
        "loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:"
        f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
        f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}"
    )
    r = run(["-i", tmp, "-af", af, "-ar", "48000", out])
    if r.returncode:
        sys.exit(r.stderr[-2000:])
    subprocess.run(["rm", "-f", tmp])
    print(f"wrote {out}")


if __name__ == "__main__":
    main(*sys.argv[1:5])
