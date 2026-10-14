import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {clamp01, easeIn, easeOut, lerp, prog} from '../lib';
import {Mask} from '../components/primitives';
import {FF, P} from './lib';

/** 0→1 in, hold, 1→0 out. Entrances ease out, exits are faster and ease in. */
export const life = (t: number, a: number, b: number, fin = 0.6, fout = 0.4) =>
  prog(t, a, a + fin, easeOut) * (1 - prog(t, b - fout, b, easeIn));

export const Abs: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({x, y, w, h, style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>{children}</div>
);

export const Photo: React.FC<{
  src: string;
  w: number;
  h: number;
  radius?: number;
  pos?: string;
  zoom?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({src, w, h, radius = 0, pos = '50% 50%', zoom = 1, shadow, style}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: radius,
      overflow: 'hidden',
      position: 'relative',
      boxShadow: shadow ? `0 ${h * 0.05}px ${h * 0.12}px ${P.shadow}` : undefined,
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: pos,
        transform: `scale(${zoom})`,
        transformOrigin: pos,
      }}
    />
  </div>
);

/** A real product box photo standing on a surface, with a contact shadow. */
export const Box: React.FC<{src: string; w: number; ratio: number; light?: number}> = ({src, w, ratio, light = 0}) => {
  const h = w * ratio;
  return (
    <div style={{position: 'relative', width: w, height: h}}>
      <div
        style={{
          position: 'absolute',
          left: w * 0.04,
          right: w * 0.04,
          bottom: -h * 0.03,
          height: h * 0.07,
          borderRadius: '50%',
          background: 'rgba(28,29,31,0.35)',
          filter: `blur(${w * 0.04}px)`,
        }}
      />
      <Img
        src={staticFile(src)}
        style={{position: 'absolute', inset: 0, width: w, height: h, borderRadius: w * 0.012, boxShadow: '0 2px 0 rgba(0,0,0,0.08)'}}
      />
      {light > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: w * 0.012,
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${lerp(-40, 120, light) - 20}%, rgba(255,255,255,0.32) ${lerp(-40, 120, light)}%, rgba(255,255,255,0) ${lerp(-40, 120, light) + 20}%)`,
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  );
};

export const BOX_RATIO = {k2: 932 / 732, artro: 928 / 728, d3: 896 / 568, aroeira: 640 / 968, sulfuroso: 608 / 944};

/** Phone, front view. (x, y) is the center; the screen is drawn by children in a w×h box. */
export const Phone: React.FC<{
  x: number;
  y: number;
  w: number;
  rot?: number;
  scale?: number;
  opacity?: number;
  screen?: string;
  children?: React.ReactNode;
}> = ({x, y, w, rot = 0, scale = 1, opacity = 1, screen = P.white, children}) => {
  const h = w * 2.06;
  const b = w * 0.035;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `rotate(${rot}deg) scale(${scale})`,
        opacity,
        borderRadius: w * 0.14,
        background: P.graphite,
        boxShadow: `0 ${w * 0.08}px ${w * 0.18}px rgba(0,0,0,0.28), inset 0 0 0 ${w * 0.006}px rgba(255,255,255,0.14)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: b,
          top: b,
          width: w - b * 2,
          height: h - b * 2,
          borderRadius: w * 0.11,
          overflow: 'hidden',
          background: screen,
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: w * 0.03,
            width: w * 0.26,
            height: w * 0.07,
            marginLeft: -w * 0.13,
            borderRadius: w,
            background: P.graphite,
          }}
        />
      </div>
    </div>
  );
};

export const DemoTag: React.FC<{dark?: boolean; size?: number}> = ({dark, size = 21}) => (
  <div
    style={{
      display: 'inline-block',
      padding: `${size * 0.45}px ${size * 0.85}px`,
      borderRadius: 999,
      fontFamily: FF.mono,
      fontSize: size,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: dark ? P.cream : P.ink,
      background: dark ? 'rgba(28,29,31,0.72)' : 'rgba(244,239,231,0.9)',
      border: `1.5px solid ${dark ? 'rgba(244,239,231,0.22)' : P.inkFaint}`,
      whiteSpace: 'nowrap',
    }}
  >
    Projeto demonstrativo
  </div>
);

/** Small uppercase label above a headline. */
export const Kicker: React.FC<{children: React.ReactNode; color?: string; k?: number}> = ({children, color = P.accent, k = 1}) => (
  <div
    style={{
      fontFamily: FF.mono,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      color,
      opacity: k,
      transform: `translateY(${(1 - k) * 14}px)`,
    }}
  >
    {children}
  </div>
);

/**
 * Big headline, word by word through a mask. `at` is when it starts, `out` when it leaves.
 * Lines are given explicitly so wrapping is designed, not accidental.
 */
export const Headline: React.FC<{
  t: number;
  at: number;
  out?: number;
  lines: string[];
  size?: number;
  color?: string;
  accent?: string[];
  accentColor?: string;
  align?: 'left' | 'center';
  weight?: number;
}> = ({t, at, out = 1e9, lines, size = 92, color = P.ink, accent = [], accentColor = P.accent, align = 'left', weight = 750}) => {
  let n = 0;
  const ko = prog(t, out - 0.4, out, easeIn);
  return (
    <div
      style={{
        fontFamily: FF.sans,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.035em',
        lineHeight: 1.04,
        color,
        textAlign: align,
      }}
    >
      {lines.map((ln, li) => (
        <div key={li} style={{whiteSpace: 'nowrap'}}>
          {ln.split(' ').map((w, wi) => {
            const k = prog(t, at + n * 0.075, at + n * 0.075 + 0.75, easeOut);
            n++;
            const clean = w.replace(/[.,?!:]/g, '');
            return (
              <React.Fragment key={wi}>
                <Mask k={k} out={ko} tilt={4}>
                  <span style={{color: accent.includes(clean) ? accentColor : color}}>{w}</span>
                </Mask>
                {wi < ln.split(' ').length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A fully drawn sticker-like chip with a dot, for short labels on visuals. */
export const Chip: React.FC<{label: string; k: number; dark?: boolean; dot?: string; size?: number}> = ({
  label,
  k,
  dark,
  dot = P.accent,
  size = 30,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.45,
      padding: `${size * 0.5}px ${size * 0.8}px`,
      borderRadius: 999,
      background: dark ? P.graphite : P.cream,
      color: dark ? P.cream : P.ink,
      fontFamily: FF.sans,
      fontWeight: 650,
      fontSize: size,
      letterSpacing: '-0.01em',
      boxShadow: `0 10px 30px ${P.shadow}`,
      opacity: clamp01(k * 1.4),
      transform: `scale(${0.85 + 0.15 * k}) translateY(${(1 - k) * 20}px)`,
      whiteSpace: 'nowrap',
    }}
  >
    <span style={{width: size * 0.42, height: size * 0.42, borderRadius: '50%', background: dot}} />
    {label}
  </div>
);

/**
 * Hand seen from above (back of the hand), fingers pointing up; rotate it to aim.
 * Origin = wrist center. `curl` 0 open … 1 gripping (fingers foreshortened).
 */
export const Hand: React.FC<{
  x: number;
  y: number;
  rot?: number;
  s?: number;
  curl?: number;
  skin?: string;
  skinDark?: string;
  sleeve?: string;
  mirror?: boolean;
}> = ({x, y, rot = 0, s = 1, curl = 0, skin = P.skinA, skinDark = P.skinADark, sleeve = P.sleeveA, mirror}) => {
  const fingers = [
    {x: -23, len: 60, w: 15.5},
    {x: -7.5, len: 70, w: 16},
    {x: 8, len: 65, w: 15.5},
    {x: 22.5, len: 50, w: 14},
  ];
  const k = 1 - 0.62 * curl;
  return (
    <svg
      width={300}
      height={900}
      viewBox="-150 -300 300 900"
      style={{
        position: 'absolute',
        left: x - 150,
        top: y - 300,
        transform: `rotate(${rot}deg) scale(${s * (mirror ? -1 : 1)}, ${s})`,
        transformOrigin: '150px 300px',
        overflow: 'visible',
        filter: 'drop-shadow(0 12px 12px rgba(28,29,31,0.22))',
      }}
    >
      <g fill={skin}>
        <rect x={-15} y={-50} width={20} height={56} rx={10} transform={`translate(-26 0) rotate(${-34 + 18 * curl} 0 0)`} />
        {fingers.map((f, i) => (
          <rect key={i} x={f.x - f.w / 2} y={-62 - f.len * k} width={f.w} height={f.len * k + 30} rx={f.w / 2} />
        ))}
        <path d="M-33 -62 Q-34 -6 -26 10 L26 10 Q34 -6 33 -66 Z" />
        <rect x={-26} y={0} width={52} height={36} rx={10} />
      </g>
      {fingers.slice(0, 3).map((f, i) => (
        <line key={i} x1={f.x + f.w / 2} y1={-58} x2={f.x + f.w / 2} y2={-62 - Math.min(f.len, fingers[i + 1].len) * k + 10} stroke={skinDark} strokeWidth={1.6} strokeLinecap="round" />
      ))}
      {curl < 0.5 &&
        fingers.map((f, i) => (
          <rect key={i} x={f.x - f.w * 0.3} y={-62 - f.len * k + 3} width={f.w * 0.6} height={f.w * 0.75} rx={f.w * 0.28} fill="rgba(255,255,255,0.28)" />
        ))}
      {fingers.map((f, i) => (
        <path key={i} d={`M${f.x - 4} -60 q4 -3 8 0`} stroke={skinDark} strokeWidth={1.4} fill="none" opacity={0.7} />
      ))}
      <rect x={-38} y={26} width={76} height={560} rx={16} fill={sleeve} />
      <rect x={-38} y={26} width={76} height={18} rx={8} fill="rgba(0,0,0,0.12)" />
    </svg>
  );
};

/** Month calendar card. `fill(day)` returns 0..1 for how far that day's chip has popped in. */
export const Calendar: React.FC<{
  w: number;
  fill: (day: number) => number;
  color?: (day: number) => string;
  title?: string;
  mark?: {day: number; k: number; label: string};
  dark?: boolean;
}> = ({w, fill, color = () => P.accent, title = 'Calendário do mês', mark, dark}) => {
  const cell = (w - 60) / 7;
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const first = 3;
  const fg = dark ? P.cream : P.ink;
  return (
    <div
      style={{
        width: w,
        padding: 30,
        borderRadius: 34,
        background: dark ? P.graphite2 : P.white,
        boxShadow: `0 30px 70px ${P.shadow}`,
        boxSizing: 'border-box',
        fontFamily: FF.sans,
        color: fg,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18}}>
        <div style={{fontSize: w * 0.05, fontWeight: 700, letterSpacing: '-0.02em'}}>{title}</div>
        <div style={{display: 'flex', gap: 10}}>
          {[0, 1].map((i) => (
            <div key={i} style={{width: w * 0.045, height: w * 0.045, borderRadius: '50%', border: `2px solid ${dark ? P.faint : P.inkFaint}`}} />
          ))}
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(7, ${cell}px)`}}>
        {days.map((d, i) => (
          <div key={i} style={{textAlign: 'center', fontFamily: FF.mono, fontSize: w * 0.028, opacity: 0.5, paddingBottom: 10}}>
            {d}
          </div>
        ))}
        {Array.from({length: 35}, (_, i) => {
          const day = i - first + 1;
          const valid = day >= 1 && day <= 30;
          const k = valid ? clamp01(fill(day)) : 0;
          const marked = mark && mark.day === day ? mark.k : 0;
          return (
            <div key={i} style={{height: cell * 0.92, position: 'relative', borderTop: `1.5px solid ${dark ? P.line : P.inkFaint}`}}>
              {valid && (
                <div style={{position: 'absolute', left: 8, top: 6, fontSize: w * 0.026, fontWeight: 600, opacity: 0.55}}>{day}</div>
              )}
              {k > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: cell * 0.18,
                    right: cell * 0.18,
                    bottom: cell * 0.12,
                    height: cell * 0.38,
                    borderRadius: cell * 0.1,
                    background: color(day),
                    transform: `scale(${0.4 + 0.6 * k})`,
                    opacity: clamp01(k * 2),
                  }}
                />
              )}
              {marked > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 3,
                    borderRadius: cell * 0.18,
                    border: `4px solid ${P.accent}`,
                    opacity: marked,
                    transform: `scale(${1.3 - 0.3 * marked})`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Solid scene background. */
export const Bg: React.FC<{color: string; children?: React.ReactNode}> = ({color, children}) => (
  <AbsoluteFill style={{background: color}}>{children}</AbsoluteFill>
);

/** Soft light pool on a surface, for depth in flat scenes. */
export const Glow: React.FC<{x: number; y: number; r: number; color?: string; o?: number}> = ({x, y, r, color = '255,255,255', o = 0.5}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(${color},${o}) 0%, rgba(${color},0) 70%)`,
    }}
  />
);
