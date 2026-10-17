# AuroraTocantins

Anúncio vertical (1080×1920, 30 fps, 60 s) de uma propriedade rural em Aurora do Tocantins. Roteiro, tempos e narração em `timeline.json`; fotos por cena em `fotos.json`.

As fotos e o vídeo do cliente não vão para o git. Para renderizar, copie-os para `public/aurora/fotos/` (no projeto: `/mnt/project-files/aurora/fotos-preparadas/`). Slot sem arquivo vira um espaço reservado marcado.

```bash
npm run aurora:voz      # narração (Kokoro, voz pf_dora); precisa de KOKORO_DIR com o modelo
npm run aurora:sfx      # trilha + narração mixadas → public/aurora/aurora.wav (-14 LUFS)
npm run aurora:render   # → out/aurora.mp4
```

Regras do cliente: não apresentar como pousada em funcionamento (uso familiar), não usar "rio exclusivo", "retorno garantido" ou "totalmente regularizada", não alterar cores das fotos, identificar cômodos só com certeza.
