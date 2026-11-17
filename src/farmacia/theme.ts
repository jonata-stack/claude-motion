import {SpringConfig} from 'remotion';
import {sp as spBase} from '../lib';
import timeline from './timeline.json';

export const RT = timeline;
export const FPS = RT.fps;
export const W = 1080;
export const H = 1920;

// Night-city diorama: navy sky, lit windows, wooden counter, paper labels, terracotta word tiles.
export const C = {
  sky: '#1B1E4A',
  skyHi: '#2B2F6E',
  bldA: '#262A63',
  bldB: '#30357A',
  bldC: '#20244F',
  winOff: '#363C8A',
  winWarm: '#FFD27A',
  winOrange: '#FF8F5E',
  winTeal: '#73E3D2',
  winWhite: '#ECE8FF',
  wood: '#B27347',
  woodHi: '#C98A5A',
  woodDark: '#6E4029',
  floor: '#3A3160',
  floorDark: '#17142B',
  paper: '#F3E9D2',
  paperDark: '#D9CBAA',
  tape: 'rgba(236,226,196,0.92)',
  ink: '#1B1A24',
  tile: '#C4513F',
  tileHi: '#D9654F',
  tileText: '#FBEEDC',
  gold: '#F2BE45',
  goldDark: '#B9842A',
  blue: '#3F6FE0',
  coral: '#E8735A',
  amber: '#D9822B',
  green: '#2FC46A',
  teal: '#0E5C4D',
  robot: '#ECEAE4',
  screen: '#22232B',
  glow: '#7BF0D8',
  red: '#E5484D',
  white: '#FFFFFF',
  chat: '#EFE6DA',
  bubbleOut: '#D7F5C6',
  shadow: 'rgba(10,8,30,0.45)',
};

export const F = {
  label: '"Archivo Black", "Arial Black", sans-serif',
  tile: '"Fraunces", Georgia, serif',
  ui: '"Inter Variable", Inter, system-ui, sans-serif',
};

/** Seconds since a beat, can be negative. */
export const since = (frame: number, beat: number) => frame / FPS - beat;

/** Mix a hex color toward black (k<1) or white (k>1). */
export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    k < 1 ? c * k : c + (255 - c) * (k - 1),
  );
  return `rgb(${ch.map((c) => Math.round(Math.min(255, Math.max(0, c)))).join(',')})`;
};

/** Spring from a beat in seconds, at this video's frame rate. */
export const sp = (frame: number, startSec: number, config: Partial<SpringConfig> = {}) => spBase(frame, startSec, config, FPS);
