import timeline from './timeline.json';
import fotos from './fotos.json';
import durations from '../../public/aurora/voz/durations.json';

export const TL = timeline;
export const FPS = TL.fps;
export const W = 1080;
export const H = 1920;
export const FOTOS = fotos;
export const VOICE_LEN: Record<string, number> = durations;

/** Instagram / TikTok UI covers the top ~250 px and bottom ~400 px. */
export const SAFE = {top: 270, bottom: H - 420, side: 72};

export const C = {
  forest: '#17221A',
  forestHi: '#223126',
  cream: '#F5F0E4',
  creamDim: 'rgba(245,240,228,0.78)',
  muted: 'rgba(245,240,228,0.5)',
  line: 'rgba(245,240,228,0.22)',
  gold: '#E8BF6A',
  water: '#7FC4CF',
  shade: 'rgba(10,14,11,0.62)',
  scrim: 'rgba(8,12,9,0.72)',
};

export const F = {
  serif: '"Instrument Serif", Georgia, serif',
  sans: '"Inter Variable", Inter, system-ui, sans-serif',
};
