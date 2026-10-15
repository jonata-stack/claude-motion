import voice from './voice.json';

/**
 * Timeline: generated from narration.json by `npm run farmacia:voz` (sfx/voice.py).
 * Every scene start/end and caption time comes from the spoken audio, so picture,
 * captions and sound can't drift apart.
 */
export const VT = voice;
export const FFPS = 30;
export const FW = 1080;
export const FH = 1920;

export type SceneId = keyof typeof voice.scenes;
export const scene = (id: SceneId) => VT.scenes[id];
/** Start time of caption `i` of a scene. */
export const cap = (id: SceneId, i: number) => VT.scenes[id].captions[i].t0;

/** Graphite + warm light base, one terracotta accent. */
export const P = {
  graphite: '#1C1D1F',
  graphite2: '#242528',
  graphite3: '#303135',
  line: 'rgba(243,238,230,0.12)',
  cream: '#F4EFE7',
  sand: '#E9E1D4',
  sand2: '#DDD2C1',
  sand3: '#C9BBA6',
  ink: '#1C1D1F',
  inkSoft: 'rgba(28,29,31,0.64)',
  inkFaint: 'rgba(28,29,31,0.14)',
  muted: 'rgba(244,239,231,0.66)',
  faint: 'rgba(244,239,231,0.18)',
  accent: '#D0703E',
  accentHi: '#E68A58',
  accentSoft: 'rgba(208,112,62,0.16)',
  white: '#FFFFFF',
  rec: '#E5484D',
  shadow: 'rgba(28,29,31,0.22)',
  skinA: '#E2B38C',
  skinADark: '#C9966F',
  skinB: '#A86F4C',
  skinBDark: '#8C5A3B',
  sleeveA: '#3B4A5A',
  sleeveB: '#C9BBA6',
};

/** Demo brands, one per segment, so each reads as its own identity. */
export const PHARMA = {bg: '#E4EEE8', green: '#1F5C45', greenHi: '#2E7A5D', ink: '#14231C', mint: '#CFE3D7'};
export const FOOD = {bg: '#2B0A1B', wine: '#4C0E2E', pink: '#E8296F', gold: '#F4C24F', cream: '#FFF3E6'};
/** Assessoria Ômega, the agency itself: its red mark on near-black. */
export const OMEGA = {red: '#E3262A', redHi: '#FF4A45', black: '#0E0E10', glow: '227,38,42'};
export const FASHION = {bg: '#EFE9DF', black: '#161616', camel: '#B98B5E', stone: '#D8CFC2', olive: '#6F6A4E'};

export const FF = {
  sans: '"Inter Variable", Inter, system-ui, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  anton: 'Anton, Impact, sans-serif',
  baloo: '"Baloo 2", system-ui, sans-serif',
};

export const IMG = {
  k2: 'farmacia/calcium-k2.jpg',
  artro: 'farmacia/calcium-artro.jpg',
  d3: 'farmacia/calcium-d3.jpg',
  aroeira: 'farmacia/sabonete-aroeira.jpg',
  sulfuroso: 'farmacia/sabonete-sulfuroso.jpg',
  vitafor: 'farmacia/vitafor.jpg',
  catarinense: 'farmacia/catarinense.jpg',
  vitaforLinha: 'farmacia/vitafor-linha.png',
  omega: 'farmacia/omega-logo.png',
  acaiBanana: 'farmacia/acai-tigela-banana.jpg',
  acaiCopo: 'farmacia/acai-copo.jpg',
  acaiKiwi: 'farmacia/acai-tigela-kiwi.jpg',
  acaiUva: 'farmacia/acai-tigela-uva.jpg',
  acaiColher: 'farmacia/acai-colher.jpg',
  acaiCopos: 'farmacia/acai-copos.jpg',
};
