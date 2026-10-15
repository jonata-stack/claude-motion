# 03 · Service pitch for local businesses (pharmacy first)

2 min 43 s · 1080×1920 · 30 fps · Portuguese narration + captions + music bed, −14 LUFS · source: [`src/farmacia/`](../../src/farmacia/), narration [`src/farmacia/narration.json`](../../src/farmacia/narration.json), music [`sfx/cues/farmacia.py`](../../sfx/cues/farmacia.py)

A sales video a two-person content team sends to shop owners on WhatsApp: ten scenes (the value the shop already has, the daily routine, who we are, the visual transformation, one look per segment, the Essencial and Presença + Vídeo plans, how it works, add-ons, invitation to reply).

How it is built:

- **Narration drives the timeline.** `narration.json` holds the script as caption-sized chunks. `sfx/voice.py` speaks it offline (Kokoro `pf_dora` through sherpa-onnx), trims each sentence, and writes `voice.json` with every scene start and caption time. The composition and the music cue sheet both read that file, so retiming = editing the script and re-running `farmacia:voz`.
- **Mix.** `sfx/cues/farmacia.py` renders only the instrumental (pad, soft piano arpeggio in D, light pulse under the offer). `sfx/voicemix.py` ducks it under the voice with a sidechain and masters to −14 LUFS.
- **Real products, illustrated people.** Product boxes are perspective-corrected cutouts of the client's photos (labels untouched). People appear only as hands and work framing, as the brief asked. Every mock profile/post carries a "Projeto demonstrativo" tag.

## Prompt

> Crie um vídeo comercial em português brasileiro para apresentar nosso serviço de produção de conteúdo e organização de Instagram para negócios locais. […] vídeo principal de aproximadamente 2 minutos e 30 segundos […] vertical 9:16 […] narração, legendas sincronizadas, trilha instrumental discreta […] (full brief with a 10-scene script, prices, commercial rules and pharmacy compliance notes; three photos: Calcium maxx boxes, Aroeira/Sulfuroso soaps, a grid of demo pharmacy posts)

## Build

```bash
pip install sherpa-onnx soundfile          # only to regenerate the voice
SHERPA_TTS_DIR=<models> npm run farmacia:voz   # kokoro-multi-lang-v1_0 from the sherpa-onnx tts-models release
npm run farmacia:build                      # music + mix + render + mux → out/farmacia.mp4
```
