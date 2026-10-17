import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {clamp01, easeIn, easeOut, lerp, prog} from '../lib';
import {C, F, FOTOS, FPS, H, SAFE, TL, VOICE_LEN, W} from './theme';

export type Slot = keyof typeof FOTOS;

const slotFile = (slot: Slot): string | null => {
  const s = FOTOS[slot] as {file: string | null};
  return s.file;
};

/** A slot with no photo falls back to `fallback` (e.g. no river photo → another real photo of the area). */
export const pick = (slot: Slot, fallback?: Slot): Slot =>
  slotFile(slot) || !fallback ? slot : fallback;

/** Full-bleed photo with a slow push-in. No color grading: the photo is shown as shot. */
export const Photo: React.FC<{
  slot: Slot;
  t: number;
  from: number;
  to: number;
  zoom?: [number, number];
  drift?: [number, number];
}> = ({slot, t, from, to, zoom = [1.04, 1.12], drift = [0, 0]}) => {
  const k = clamp01((t - from) / (to - from));
  const s = lerp(zoom[0], zoom[1], k);
  const tx = drift[0] * (k - 0.5);
  const ty = drift[1] * (k - 0.5);
  const info = FOTOS[slot] as {file: string | null; hint: string; focus: string};
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.forest}}>
      <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s})`}}>
        {info.file?.endsWith('.mp4') ? (
          <Sequence from={Math.round(from * FPS)} layout="none">
            <OffthreadVideo
              muted
              src={staticFile(`aurora/fotos/${info.file}`)}
              style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: info.focus}}
            />
          </Sequence>
        ) : info.file ? (
          <Img
            src={staticFile(`aurora/fotos/${info.file}`)}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: info.focus}}
          />
        ) : (
          <Placeholder hint={info.hint} slot={slot} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Placeholder: React.FC<{hint: string; slot: string}> = ({hint, slot}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(120% 80% at 50% 40%, ${C.forestHi} 0%, ${C.forest} 70%)`,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 40,
        border: `4px dashed ${C.line}`,
        borderRadius: 28,
      }}
    />
    <div
      style={{
        fontFamily: F.sans,
        color: C.muted,
        fontSize: 40,
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        textAlign: 'center',
        position: 'absolute',
        top: 860,
        width: 800,
      }}
    >
      Foto: {hint}
      <div style={{fontSize: 28, marginTop: 16, letterSpacing: '0.1em'}}>{slot}</div>
    </div>
  </AbsoluteFill>
);

/** Darkens only the top and bottom bands where text sits, leaving the middle of the photo untouched. */
export const Scrim: React.FC<{top?: number; bottom?: number}> = ({top = 1, bottom = 1}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg,
        rgba(8,12,9,${0.66 * top}) 0%,
        rgba(8,12,9,${0.42 * top}) 22%,
        rgba(8,12,9,0) 40%,
        rgba(8,12,9,0) 58%,
        rgba(8,12,9,${0.5 * bottom}) 74%,
        rgba(8,12,9,${0.72 * bottom}) 100%)`,
    }}
  />
);

/** Enter (rise + fade, easeOut) at `a`, leave (fade, easeIn) ending at `b`. */
export const inOut = (t: number, a: number, b: number, enter = 0.9, exit = 0.45) => {
  const i = prog(t, a, a + enter, easeOut);
  const o = prog(t, b - exit, b, easeIn);
  return {k: i * (1 - o), y: (1 - i) * 36, o};
};

export const Block: React.FC<{
  t: number;
  at: number;
  until: number;
  top?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({t, at, until, top = SAFE.top + 40, children, style}) => {
  const {k, y} = inOut(t, at, until);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        top,
        opacity: k,
        transform: `translateY(${y}px)`,
        color: C.cream,
        fontFamily: F.sans,
        textShadow: '0 4px 28px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.6)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Row: React.FC<{
  t: number;
  at: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: number;
}> = ({t, at, icon, children, size = 74}) => {
  const k = prog(t, at, at + 0.8, easeOut);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        opacity: k,
        transform: `translateX(${(1 - k) * -40}px)`,
        fontSize: size,
        fontWeight: 760,
        letterSpacing: '-0.02em',
        lineHeight: 1.08,
        marginBottom: 26,
      }}
    >
      {icon && <div style={{width: 96, height: 96, flex: 'none'}}>{icon}</div>}
      <div>{children}</div>
    </div>
  );
};

const ICON = {fill: 'none', stroke: C.gold, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round'} as const;

export const Icon: React.FC<{name: 'area' | 'serra' | 'pin' | 'casa' | 'cama' | 'chave' | 'estrada' | 'fone' | 'doc'}> = ({
  name,
}) => (
  <svg viewBox="0 0 96 96" width={96} height={96} style={{filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.5))'}}>
    {name === 'area' && (
      <>
        <path d="M18 34V18h16M62 18h16v16M78 62v16H62M34 78H18V62" {...ICON} />
        <rect x="32" y="32" width="32" height="32" rx="3" {...ICON} strokeWidth={4} opacity={0.7} />
      </>
    )}
    {name === 'serra' && <path d="M10 76 36 38l14 18 12-16 24 36Z" {...ICON} />}
    {name === 'pin' && (
      <>
        <path d="M48 86s26-26 26-44a26 26 0 0 0-52 0c0 18 26 44 26 44Z" {...ICON} />
        <circle cx="48" cy="42" r="9" {...ICON} />
      </>
    )}
    {name === 'casa' && <path d="M16 46 48 20l32 26M24 40v38h48V40M41 78V58h14v20" {...ICON} />}
    {name === 'cama' && <path d="M12 72V30M12 56h72v16M84 56V46a10 10 0 0 0-10-10H42v20M22 46a7 7 0 1 0 14 0 7 7 0 1 0-14 0" {...ICON} />}
    {name === 'chave' && (
      <>
        <circle cx="32" cy="48" r="14" {...ICON} />
        <path d="M46 48h38M72 48v12M82 48v8" {...ICON} />
      </>
    )}
    {name === 'estrada' && <path d="M34 86 44 10M62 86 52 10M48 80v-8M48 60v-8M48 40v-8M48 20v-4" {...ICON} />}
    {name === 'fone' && (
      <path
        d="M30 14h-8a8 8 0 0 0-8 9c3 32 27 56 59 59a8 8 0 0 0 9-8v-8a6 6 0 0 0-5-6l-12-3a6 6 0 0 0-6 2l-5 5a48 48 0 0 1-20-20l5-5a6 6 0 0 0 2-6l-3-12a6 6 0 0 0-6-5Z"
        {...ICON}
      />
    )}
    {name === 'doc' && <path d="M26 12h30l16 16v56H26ZM56 12v16h16M36 50h26M36 62h26M36 74h16" {...ICON} />}
  </svg>
);

/** Narration captions: each line split into short chunks, timed by character count across its spoken length. */
const chunks = (text: string, max = 34) => {
  const out: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    if (cur && (cur + ' ' + w).length > max) {
      out.push(cur);
      cur = w;
    } else cur = cur ? cur + ' ' + w : w;
    if (/[.,]$/.test(w) && cur.length > max * 0.55) {
      out.push(cur);
      cur = '';
    }
  }
  if (cur) out.push(cur);
  return out;
};

export const Captions: React.FC<{t: number}> = ({t}) => {
  let shown: {text: string; k: number} | null = null;
  for (const line of TL.voice) {
    const t0 = (TL as unknown as Record<string, {voice: number}>)[line.scene].voice;
    const len = VOICE_LEN[line.id];
    if (t < t0 - 0.1 || t > t0 + len + 0.5) continue;
    const parts = chunks(line.text);
    const total = parts.reduce((a, p) => a + p.length, 0);
    let acc = t0;
    parts.forEach((p, i) => {
      const d = (p.length / total) * len;
      const end = i === parts.length - 1 ? t0 + len + 0.5 : acc + d;
      if (t >= acc - 0.08 && t < end) shown = {text: p, k: clamp01((t - acc + 0.08) / 0.16)};
      acc += d;
    });
  }
  if (!shown) return null;
  const {text, k} = shown as {text: string; k: number};
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: SAFE.bottom - 150,
        display: 'flex',
        justifyContent: 'center',
        opacity: k,
      }}
    >
      <div
        style={{
          maxWidth: W - 2 * SAFE.side - 40,
          padding: '18px 30px 22px',
          borderRadius: 22,
          background: C.shade,
          color: C.cream,
          fontFamily: F.sans,
          fontSize: 50,
          fontWeight: 600,
          lineHeight: 1.22,
          textAlign: 'center',
          letterSpacing: '-0.005em',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const fullH = H;
