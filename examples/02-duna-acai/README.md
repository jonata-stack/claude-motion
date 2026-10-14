# 02 · Duna Açaí (Reels/Stories)

13 s · 1080×1920 · 60 fps · stereo, −14 LUFS · source: [`src/duna/DunaAcai.tsx`](../../src/duna/DunaAcai.tsx), timeline [`src/duna/timeline.json`](../../src/duna/timeline.json), sound [`sfx/cues/duna_acai.py`](../../sfx/cues/duna_acai.py)

First draft of a vertical ad for an açaí shop (fictional demo profile). Three beats taken from the approved Instagram draft:

1. **Deu vontade?** over a bowl photo.
2. **Monte do seu jeito**: the photo card morphs into a round bowl and five topping chips pop in and get "tapped" one by one.
3. The chips drop into the bowl, the bowl opens as an iris onto the logo and the **Peça pelo WhatsApp** button, which gets a tap.

Palette and type follow the draft: dark wine, magenta, gold titles in Anton, the logo set in Baloo 2.
The photos in `public/duna/` are crops of the draft mockup and only placeholders until the shop sends real ones.

## Prompt

> Quero começar a usar Motion para fazer criativos para lojas. A primeira é uma loja de açaí, Duna Açaí. Um criativo simples e bacana, interativo. (two screenshots: the current Instagram and the new-identity draft)

## Build

```bash
npm run duna:build   # sound + render + mux → out/duna-acai.mp4
```
