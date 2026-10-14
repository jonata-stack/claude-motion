import timeline from './timeline.json';

export const DTL = timeline;
export const DW = 1080;
export const DH = 1920;

/** Duna Açaí palette, taken from the approved draft: dark wine, magenta, gold. */
export const D = {
  bg: '#13050C',
  wine: '#2B0A1B',
  wineHi: '#4C0E2E',
  pink: '#E8296F',
  pinkHi: '#FF5A93',
  pinkDeep: '#9E1446',
  gold: '#F4C24F',
  goldHi: '#FFDC80',
  cream: '#FFF3E6',
  creamDim: 'rgba(255,243,230,0.72)',
  ink: '#2B0A1B',
};

export const DF = {
  display: 'Anton, Impact, sans-serif',
  logo: '"Baloo 2", system-ui, sans-serif',
  sans: '"Inter Variable", Inter, system-ui, sans-serif',
};

/** Photos cropped from the draft grid; placeholders until the store sends real ones. */
export const PHOTO = {
  uva: 'duna/tigela-uva.jpg',
  banana: 'duna/tigela-banana.jpg',
};

export const TOPPINGS = ['Banana', 'Granola', 'Coco ralado', 'Morango', 'Leite em pó'];
