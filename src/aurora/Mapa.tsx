import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeInOut, easeOut, prog, sp} from '../lib';
import {C, F, FPS, TL} from './theme';

// Schematic only: relative placement, not to scale. Aurora at the centre, the property ~9 km away
// with the last ~4 km on dirt road, Rio Azuis on the paved road (~20 min from the property).
const P = {
  aurora: {x: 470, y: 400},
  prop: {x: 800, y: 210},
  azuis: {x: 270, y: 560},
  dirt: {x: 650, y: 300},
};
const PAVED = `M ${P.aurora.x} ${P.aurora.y} C 540 370, 600 330, ${P.dirt.x} ${P.dirt.y}`;
const DIRT = `M ${P.dirt.x} ${P.dirt.y} C 700 270, 740 250, ${P.prop.x} ${P.prop.y}`;
const TO_AZUIS = `M ${P.aurora.x} ${P.aurora.y} C 430 460, 350 500, ${P.azuis.x} ${P.azuis.y}`;
const BG_ROADS = ['M -20 520 C 200 470, 330 430, 470 400 S 900 380, 1100 330', 'M 470 400 C 480 300, 450 160, 400 -20'];

const Pin: React.FC<{x: number; y: number; k: number; color: string; size?: number; label: string; sub?: string; side?: 'l' | 'r'}> = ({
  x,
  y,
  k,
  color,
  size = 1,
  label,
  sub,
  side = 'r',
}) => (
  <g transform={`translate(${x} ${y})`} opacity={clamp01(k * 1.5)}>
    <ellipse rx={22 * size * k} ry={8 * size * k} fill="#000" opacity={0.35} />
    <g transform={`scale(${k * size}) translate(0 -6)`}>
      <path d="M0 0c0 0-24-26-24-44a24 24 0 0 1 48 0C24-26 0 0 0 0Z" fill={color} stroke={C.forest} strokeWidth={4} />
      <circle cy={-44} r={9} fill={C.forest} />
    </g>
    <text
      x={side === 'r' ? 40 : -40}
      y={-34}
      textAnchor={side === 'r' ? 'start' : 'end'}
      fill={C.cream}
      fontFamily={F.sans}
      fontWeight={760}
      fontSize={46}
      opacity={k}
    >
      {label}
    </text>
    {sub && (
      <text x={side === 'r' ? 40 : -40} y={10} textAnchor={side === 'r' ? 'start' : 'end'} fill={C.creamDim} fontFamily={F.sans} fontWeight={500} fontSize={32} opacity={k}>
        {sub}
      </text>
    )}
  </g>
);

const draw = (k: number) => ({strokeDasharray: 1000, strokeDashoffset: 1000 * (1 - k)});

export const Mapa: React.FC<{frame: number; t: number}> = ({frame, t}) => {
  const s = TL.s5;
  const POP = {damping: 10, stiffness: 210, mass: 0.7};
  const base = prog(t, s.map, s.map + 1.2, easeOut);
  const paved = prog(t, s.aurora + 0.2, s.road, easeInOut);
  const dirt = prog(t, s.road, s.road + 0.9, easeInOut);
  const azuis = prog(t, s.azuis - 0.6, s.azuis + 0.2, easeInOut);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(90% 60% at 55% 45%, ${C.forestHi} 0%, ${C.forest} 75%)`,
      }}
    >
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        <g transform="translate(-70 470) scale(1.13)" opacity={base}>
          {Array.from({length: 12}, (_, i) => (
            <line key={`h${i}`} x1={0} x2={1080} y1={i * 64} y2={i * 64} stroke={C.line} strokeWidth={1} opacity={0.35} />
          ))}
          {Array.from({length: 18}, (_, i) => (
            <line key={`v${i}`} y1={-40} y2={740} x1={i * 64} x2={i * 64} stroke={C.line} strokeWidth={1} opacity={0.35} />
          ))}
          {BG_ROADS.map((d) => (
            <path key={d} d={d} fill="none" stroke={C.line} strokeWidth={8} strokeLinecap="round" />
          ))}
          <path d={TO_AZUIS} pathLength={1000} fill="none" stroke={C.water} strokeWidth={9} strokeLinecap="round" style={draw(azuis)} opacity={0.85} />
          <path d={PAVED} pathLength={1000} fill="none" stroke={C.cream} strokeWidth={10} strokeLinecap="round" style={draw(paved)} />
          <mask id="dirtReveal" maskUnits="userSpaceOnUse" x={0} y={-100} width={1080} height={900}>
            <path d={DIRT} pathLength={1000} fill="none" stroke="#fff" strokeWidth={16} style={draw(dirt)} />
          </mask>
          <path d={DIRT} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" strokeDasharray="20 18" mask="url(#dirtReveal)" />
          <Pin {...P.azuis} k={sp(frame, s.azuis, POP, FPS)} color={C.water} label="Rio Azuis" sub="atrativo da região" />
          <Pin {...P.aurora} k={sp(frame, s.aurora, POP, FPS)} color={C.cream} size={0.8} label="Aurora" sub="do Tocantins" side="l" />
          <Pin {...P.prop} k={sp(frame, s.property, POP, FPS)} color={C.gold} size={1.25} label="A propriedade" side="l" />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          top: 492,
          fontFamily: F.sans,
          fontSize: 26,
          color: C.muted,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textAlign: 'right',
          opacity: base,
        }}
      >
        Mapa ilustrativo · fora de escala
      </div>
    </AbsoluteFill>
  );
};
