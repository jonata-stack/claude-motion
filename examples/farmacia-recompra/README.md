# Farmácia: recompra no automático (v2)

**Pedido:** refazer o vídeo de 70 s (9:16) sobre recompra de fórmulas no estilo do vídeo de referência
(cidade à noite, bonecos em bloco 3D, etiqueta de papel colada no topo, palavras faladas em plaquinhas terracota).

**Como foi feito**
- Fala e áudio são os do vídeo original (`public/farmacia/fala.mp4`, fora do git). As frases e seus tempos foram lidos
  das legendas da versão 1 e estão em `src/farmacia/timeline.json`; tudo na tela segue esse arquivo.
- Os trechos de rosto viram um card de papel, recortado para esconder as legendas antigas; em "cliente some" o
  recorte dá um soco de zoom, que também esconde a etiqueta queimada no vídeo.
- Os bonecos são caixas em CSS 3D (`Box`, `Critter`, `Robot`, `Jar`, `Shop` em `src/farmacia/parts.tsx`).

**Render**
```bash
npx remotion render FarmaciaRecompra out/farmacia-silent.mp4
ffmpeg -y -i out/farmacia-silent.mp4 -i public/farmacia/fala.mp4 -map 0:v -map 1:a -c:v copy -c:a copy -shortest out/farmacia.mp4
```
