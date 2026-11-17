import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {clamp01, easeOut, rand} from '../lib';
import {C, F, FPS, H, RT, shade, since, sp, W} from './theme';

export const COUNTER_Y = 1170;

/* ---------- backdrop ---------- */

const WIN_COLORS = [C.winWarm, C.winWarm, C.winOrange, C.winTeal, C.winWhite];

/** Night skyline of lit windows; drawn once, drifts slowly for depth. */
export const City: React.FC<{frame: number}> = ({frame}) => {
  const layers = useMemo(() => {
    const out: {x: number; y: number; w: number; h: number; c: string; layer: number}[][] = [[], []];
    const wins: {x: number; y: number; c: string; layer: number; seed: number}[] = [];
    [0, 1].forEach((layer) => {
      let x = -120;
      let i = 0;
      while (x < W + 120) {
        const seed = layer * 100 + i;
        const w = 110 + rand(seed) * 150;
        const h = (layer === 0 ? 520 : 380) + rand(seed + 7) * (layer === 0 ? 420 : 380);
        const y = COUNTER_Y - h;
        const c = layer === 0 ? C.bldC : [C.bldA, C.bldB][Math.floor(rand(seed + 3) * 2)];
        out[layer].push({x, y, w, h, c, layer});
        const cell = layer === 0 ? 22 : 30;
        for (let wy = y + 24; wy < COUNTER_Y - 30; wy += cell) {
          for (let wx = x + 14; wx < x + w - 18; wx += cell) {
            const r = rand(wx * 3.1 + wy * 7.7 + layer);
            if (r < 0.5) wins.push({x: wx, y: wy, c: r < 0.36 ? C.winOff : WIN_COLORS[Math.floor(rand(wx + wy) * 5)], layer, seed: wx + wy});
          }
        }
        x += w + 6 + rand(seed + 11) * 20;
        i++;
      }
    });
    return {out, wins};
  }, []);
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${C.sky} 0%, ${C.skyHi} 55%, ${C.bldB} 100%)`}}>
      {[0, 1].map((layer) => (
        <svg
          key={layer}
          width={W + 240}
          height={H}
          style={{
            position: 'absolute',
            left: -120 + Math.sin(t * 0.13 + layer) * (layer ? 18 : 8),
            top: 0,
            filter: `blur(${layer ? 2.2 : 4}px)`,
            opacity: layer ? 1 : 0.85,
          }}
        >
          <g transform="translate(120 0)">
            {layers.out[layer].map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
            ))}
            {layers.wins
              .filter((w) => w.layer === layer)
              .map((w, i) => {
                const flick = rand(w.seed + Math.floor(t * 0.7 + rand(w.seed) * 9)) > 0.985 ? 0.35 : 1;
                const s = layer ? 16 : 11;
                return <rect key={i} x={w.x} y={w.y} width={s} height={s} fill={w.c} opacity={(w.c === C.winOff ? 0.8 : 0.95) * flick} />;
              })}
          </g>
        </svg>
      ))}
    </AbsoluteFill>
  );
};

/** Wooden counter all characters stand on, plus the floor below it. */
export const Counter: React.FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: COUNTER_Y - 50,
        width: W,
        height: 70,
        background: `linear-gradient(180deg, ${C.woodHi}, ${C.wood})`,
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0 160px, rgba(0,0,0,0.12) 160px 163px), linear-gradient(180deg, ${C.woodHi}, ${C.wood})`,
        boxShadow: 'inset 0 3px 0 rgba(255,255,255,0.18)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: COUNTER_Y + 20,
        width: W,
        height: 80,
        background: `linear-gradient(180deg, ${C.woodDark}, ${shade(C.woodDark, 0.7)})`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: COUNTER_Y + 100,
        width: W,
        height: H - COUNTER_Y - 100,
        background: `radial-gradient(ellipse 70% 40% at 50% 10%, ${C.floor}, ${C.floorDark} 90%)`,
      }}
    />
  </>
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(5,4,20,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

/* ---------- type ---------- */

const current = <T extends [number, ...unknown[]]>(list: T[], t: number) => {
  let idx = -1;
  list.forEach((l, i) => {
    if (l[0] <= t) idx = i;
  });
  return idx;
};

/** Paper label taped to the top of the frame; pops in on every change. */
export const TapeLabel: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const labels = RT.labels as [number, string][];
  const i = current(labels, t);
  if (i < 0) return null;
  const [start, text] = labels[i];
  const k = sp(frame, start, {damping: 10, stiffness: 210, mass: 0.7});
  const hero = text === 'VENDEU DE NOVO!';
  const rot = (i % 2 ? 1.4 : -1.6) + (1 - k) * (i % 2 ? 8 : -8);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 268, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          transform: `scale(${0.55 + 0.45 * k}) rotate(${rot}deg)`,
          opacity: clamp01(k * 3),
          background: hero ? C.green : C.paper,
          color: hero ? C.white : C.ink,
          fontFamily: F.label,
          fontSize: hero ? 64 : 50,
          letterSpacing: '0.01em',
          padding: '20px 44px 18px',
          boxShadow: `0 10px 0 ${hero ? shade(C.green, 0.6) : C.paperDark}, 0 22px 30px ${C.shadow}`,
          whiteSpace: 'nowrap',
          textShadow: hero ? `0 3px 0 ${shade(C.green, 0.55)}` : undefined,
        }}
      >
        {text}
        {[-1, 1].map((s) => (
          <div
            key={s}
            style={{
              position: 'absolute',
              top: -16,
              [s < 0 ? 'left' : 'right']: -26,
              width: 80,
              height: 34,
              background: C.tape,
              transform: `rotate(${s * 32}deg)`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

/** Spoken words as terracotta tiles, popping in one by one under the stage. */
export const WordTiles: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const ph = RT.phrases as [number, string, number[]][];
  const i = current(ph, t);
  if (i < 0) return null;
  const [start, text, accent] = ph[i];
  const end = i + 1 < ph.length ? ph[i + 1][0] : RT.phrasesEnd;
  if (t > end) return null;
  const words = text.split(' ');
  const step = Math.min(0.24, ((end - start) * 0.6) / words.length);
  const out = clamp01((t - (end - 0.08)) / 0.08);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 1318,
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 14,
        opacity: 1 - out,
      }}
    >
      {words.map((w, j) => {
        const k = sp(frame, start + j * step, {damping: 11, stiffness: 230, mass: 0.6});
        const gold = accent.includes(j);
        return (
          <div
            key={j}
            style={{
              fontFamily: F.tile,
              fontWeight: 800,
              fontSize: 68,
              lineHeight: 1,
              padding: '10px 20px 14px',
              borderRadius: 6,
              background: gold ? C.gold : C.tile,
              color: gold ? C.ink : C.tileText,
              boxShadow: `0 7px 0 ${gold ? C.goldDark : shade(C.tile, 0.62)}, 0 16px 22px ${C.shadow}`,
              transform: `translateY(${(1 - k) * 34}px) scale(${0.6 + 0.4 * k}) rotate(${(rand(i * 9 + j) - 0.5) * 4}deg)`,
              opacity: clamp01(k * 4),
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- 3D blocks ---------- */

/** A CSS 3D cuboid. Children land on the front face. */
export const Box: React.FC<{
  w: number;
  h: number;
  d: number;
  color: string;
  front?: React.ReactNode;
  frontBg?: string;
  style?: React.CSSProperties;
  radius?: number;
}> = ({w, h, d, color, front, frontBg, style, radius = 8}) => {
  const face = (extra: React.CSSProperties, bg: string): React.CSSProperties => ({
    position: 'absolute',
    background: bg,
    borderRadius: radius,
    backfaceVisibility: 'hidden',
    ...extra,
  });
  return (
    <div style={{position: 'absolute', width: w, height: h, transformStyle: 'preserve-3d', ...style}}>
      <div style={face({width: w, height: h, transform: `translateZ(${d / 2}px)`, overflow: 'visible'}, frontBg ?? `radial-gradient(ellipse 90% 80% at 35% 25%, ${shade(color, 1.12)}, ${color} 60%, ${shade(color, 0.86)})`)}>
        {front}
      </div>
      <div style={face({width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`}, shade(color, 0.6))} />
      <div style={face({width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`}, `linear-gradient(90deg, ${shade(color, 0.72)}, ${shade(color, 0.6)})`)} />
      <div style={face({width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`}, shade(color, 0.82))} />
      <div style={face({width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`}, `linear-gradient(0deg, ${shade(color, 1.08)}, ${shade(color, 1.25)})`)} />
      <div style={face({width: w, height: d, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`}, shade(color, 0.45))} />
    </div>
  );
};

/** Places a 3D object so its base sits on (x, baseY), seen slightly from above. */
export const Prop: React.FC<{
  x: number;
  baseY?: number;
  w: number;
  h: number;
  ry?: number;
  scale?: number;
  lift?: number;
  squash?: number;
  shadowW?: number;
  children: React.ReactNode;
}> = ({x, baseY = COUNTER_Y - 10, w, h, ry = -22, scale = 1, lift = 0, squash = 0, shadowW, children}) => (
  <>
    <div
      style={{
        position: 'absolute',
        left: x - ((shadowW ?? w) * 1.2 * scale) / 2,
        top: baseY - 22 * scale,
        width: (shadowW ?? w) * 1.2 * scale,
        height: 44 * scale,
        borderRadius: '50%',
        background: `radial-gradient(ellipse at center, rgba(20,10,30,${0.5 - Math.min(0.35, lift / 400)}), rgba(20,10,30,0) 70%)`,
        transform: `scale(${1 - Math.min(0.4, lift / 300)})`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: baseY - h - lift,
        width: w,
        height: h,
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 100%',
        transform: `scale(${scale * (1 + squash * 0.5)}, ${scale * (1 - squash)}) rotateX(-12deg) rotateY(${ry}deg)`,
      }}
    >
      {children}
    </div>
  </>
);

const Eyes: React.FC<{s: number; kind: 'glasses' | 'happy' | 'dots'; blink: number}> = ({s, kind, blink}) => {
  if (kind === 'happy')
    return (
      <svg width={s * 0.6} height={s * 0.2} viewBox="0 0 60 20" style={{position: 'absolute', left: s * 0.2, top: s * 0.3}}>
        <path d="M4 16 Q12 2 20 16 M40 16 Q48 2 56 16" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'glasses')
    return (
      <div style={{position: 'absolute', left: s * 0.12, top: s * 0.22, width: s * 0.76, height: s * 0.3}}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * s * 0.42,
              width: s * 0.3,
              height: s * 0.3,
              borderRadius: '50%',
              border: `${s * 0.045}px solid ${C.ink}`,
              background: 'rgba(255,255,255,0.85)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: s * 0.08,
                height: s * 0.08 * (1 - blink * 0.9),
                transform: 'translate(-50%,-50%)',
                borderRadius: '50%',
                background: C.ink,
              }}
            />
          </div>
        ))}
        <div style={{position: 'absolute', left: s * 0.29, top: s * 0.12, width: s * 0.14, height: s * 0.04, background: C.ink}} />
      </div>
    );
  return (
    <>
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s * (0.27 + i * 0.36),
            top: s * 0.3,
            width: s * 0.1,
            height: s * 0.13 * (1 - blink * 0.9),
            borderRadius: '50%',
            background: C.ink,
          }}
        />
      ))}
    </>
  );
};

/** Cute block creature with four stubby legs. */
export const Critter: React.FC<{
  frame: number;
  s: number;
  color: string;
  eyes: 'glasses' | 'happy' | 'dots';
  headset?: boolean;
  bow?: boolean;
  mouth?: 'smile' | 'o' | 'flat';
  seed?: number;
}> = ({frame, s, color, eyes, headset, bow, mouth = 'smile', seed = 0}) => {
  const t = frame / FPS;
  const bh = s * 0.86;
  const legH = s * 0.2;
  const breathe = Math.sin(t * 2.4 + seed) * 0.012;
  const bp = (t + seed * 0.37) % 3.3;
  const blink = bp < 0.12 ? Math.sin((bp / 0.12) * Math.PI) : 0;
  const face = (
    <>
      <Eyes s={s} kind={eyes} blink={blink} />
      {mouth === 'smile' && (
        <svg width={s * 0.16} height={s * 0.08} viewBox="0 0 16 8" style={{position: 'absolute', left: s * 0.42, top: s * 0.58}}>
          <path d="M2 2 Q8 9 14 2" stroke={C.ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />
        </svg>
      )}
      {mouth === 'o' && (
        <div style={{position: 'absolute', left: s * 0.45, top: s * 0.57, width: s * 0.1, height: s * 0.12, borderRadius: '50%', background: C.ink}} />
      )}
      {mouth === 'flat' && <div style={{position: 'absolute', left: s * 0.42, top: s * 0.62, width: s * 0.16, height: s * 0.03, borderRadius: 4, background: C.ink}} />}
      <div style={{position: 'absolute', left: s * 0.12, top: s * 0.55, width: s * 0.12, height: s * 0.06, borderRadius: '50%', background: 'rgba(255,120,120,0.45)'}} />
      <div style={{position: 'absolute', left: s * 0.76, top: s * 0.55, width: s * 0.12, height: s * 0.06, borderRadius: '50%', background: 'rgba(255,120,120,0.45)'}} />
      {headset && (
        <svg width={s * 1.3} height={s * 0.9} viewBox="0 0 130 90" style={{position: 'absolute', left: -s * 0.15, top: -s * 0.32, overflow: 'visible'}}>
          <path d="M10 60 Q10 4 65 4 Q120 4 120 60" stroke={C.ink} strokeWidth={9} fill="none" />
          <rect x={0} y={44} width={22} height={36} rx={9} fill={C.ink} />
          <rect x={108} y={44} width={22} height={36} rx={9} fill={C.ink} />
          <path d="M112 76 Q104 104 76 100" stroke={C.ink} strokeWidth={5} fill="none" />
          <circle cx={74} cy={100} r={6} fill={C.ink} />
        </svg>
      )}
      {bow && (
        <svg width={s * 0.4} height={s * 0.24} viewBox="0 0 40 24" style={{position: 'absolute', left: s * 0.58, top: -s * 0.12}}>
          <path d="M20 12 L4 2 L4 22 Z M20 12 L36 2 L36 22 Z" fill={C.red} stroke={C.ink} strokeWidth={2} strokeLinejoin="round" />
          <circle cx={20} cy={12} r={5} fill={C.red} stroke={C.ink} strokeWidth={2} />
        </svg>
      )}
    </>
  );
  return (
    <div style={{position: 'absolute', width: s, height: bh + legH, transformStyle: 'preserve-3d'}}>
      {[-1, 1].map((zs) =>
        [0.14, 0.7].map((lx) => (
          <Box key={`${zs}${lx}`} w={s * 0.16} h={legH + 6} d={s * 0.16} color={shade(color, 0.8)} radius={6} style={{left: s * lx, top: bh - 6, transform: `translateZ(${zs * s * 0.2}px)`}} />
        )),
      )}
      <Box
        w={s}
        h={bh}
        d={s * 0.7}
        color={color}
        radius={14}
        front={face}
        style={{transformOrigin: '50% 100%', transform: `scaleY(${1 + breathe})`}}
      />
    </div>
  );
};

/** The system: a friendly robot with a screen face. */
export const Robot: React.FC<{frame: number; s: number}> = ({frame, s}) => {
  const t = frame / FPS;
  const bp = t % 2.9;
  const blink = bp < 0.12 ? Math.sin((bp / 0.12) * Math.PI) : 0;
  const headH = s * 0.74;
  const glow = 0.75 + 0.25 * Math.sin(t * 3);
  return (
    <div style={{position: 'absolute', width: s, height: s * 1.5, transformStyle: 'preserve-3d'}}>
      <Box w={s * 0.14} h={s * 0.26} d={s * 0.14} color="#4A4A55" radius={5} style={{left: s * 0.24, top: s * 1.24}} />
      <Box w={s * 0.14} h={s * 0.26} d={s * 0.14} color="#4A4A55" radius={5} style={{left: s * 0.62, top: s * 1.24}} />
      <Box
        w={s * 0.7}
        h={s * 0.46}
        d={s * 0.5}
        color={C.robot}
        radius={10}
        style={{left: s * 0.15, top: s * 0.8}}
        front={<div style={{position: 'absolute', left: s * 0.2, top: s * 0.12, width: s * 0.3, height: s * 0.18, borderRadius: 6, background: C.glow, opacity: glow, boxShadow: `0 0 18px ${C.glow}`}} />}
      />
      <Box
        w={s}
        h={headH}
        d={s * 0.72}
        color={C.robot}
        radius={16}
        style={{top: s * 0.06}}
        front={
          <div style={{position: 'absolute', left: s * 0.1, top: s * 0.1, width: s * 0.8, height: headH - s * 0.2, borderRadius: 14, background: C.screen, boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.6)'}}>
            <svg width={s * 0.5} height={s * 0.2} viewBox="0 0 50 20" style={{position: 'absolute', left: s * 0.15, top: s * 0.14, filter: `drop-shadow(0 0 6px ${C.glow})`}}>
              <path d={blink > 0.5 ? 'M4 12 L18 12 M32 12 L46 12' : 'M4 15 Q11 3 18 15 M32 15 Q39 3 46 15'} stroke={C.glow} strokeWidth={4.5} fill="none" strokeLinecap="round" />
            </svg>
          </div>
        }
      />
      <div style={{position: 'absolute', left: s * 0.48, top: -s * 0.14, width: s * 0.04, height: s * 0.2, background: '#4A4A55'}} />
      <div style={{position: 'absolute', left: s * 0.44, top: -s * 0.2, width: s * 0.12, height: s * 0.12, borderRadius: '50%', background: C.green, boxShadow: `0 0 ${10 * glow}px ${C.green}`}} />
    </div>
  );
};

/** Compounded-formula jar; `fill` 1 = full, 0 = empty. */
export const Jar: React.FC<{s: number; fill: number}> = ({s, fill}) => {
  const h = s * 1.15;
  const glass = '#F2DFC0';
  const body = fill > 0.02 ? C.amber : glass;
  return (
    <div style={{position: 'absolute', width: s, height: h + s * 0.22, transformStyle: 'preserve-3d'}}>
      <Box
        w={s}
        h={h}
        d={s * 0.8}
        color={fill > 0.5 ? C.amber : glass}
        radius={18}
        style={{top: s * 0.22}}
        frontBg={`linear-gradient(0deg, ${body} ${fill * 100}%, ${glass} ${fill * 100}%)`}
        front={
          <div style={{position: 'absolute', left: s * 0.12, right: s * 0.12, top: h * 0.36, padding: '6px 0', background: C.white, border: `3px solid ${C.ink}`, borderRadius: 6, textAlign: 'center', fontFamily: F.label, fontSize: s * 0.13, color: C.ink}}>
            FÓRMULA
          </div>
        }
      />
      <Box w={s * 0.78} h={s * 0.24} d={s * 0.62} color={C.green} radius={8} style={{left: s * 0.11, top: s * 0.02}} />
    </div>
  );
};

/** Little storefront. */
export const Shop: React.FC<{w: number; name: string; color: string}> = ({w, name, color}) => {
  const h = w * 0.85;
  return (
    <div style={{position: 'absolute', width: w, height: h, transformStyle: 'preserve-3d'}}>
      <Box
        w={w}
        h={h}
        d={w * 0.5}
        color="#F4F1EA"
        radius={6}
        front={
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.2, background: color, borderRadius: '6px 6px 0 0', color: C.white, fontFamily: F.label, fontSize: w * 0.085, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {name}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.2, height: h * 0.1, background: `repeating-linear-gradient(90deg, ${color} 0 ${w / 10}px, ${C.white} ${w / 10}px ${w / 5}px)`}} />
            <div style={{position: 'absolute', left: w * 0.1, top: h * 0.42, width: w * 0.32, height: w * 0.26, background: '#BFE3F2', border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{color: C.green, fontFamily: F.label, fontSize: w * 0.2, lineHeight: 1}}>+</div>
            </div>
            <div style={{position: 'absolute', left: w * 0.56, top: h * 0.42, width: w * 0.3, height: h * 0.58, background: '#7CC3E8', border: `4px solid ${C.ink}`, borderBottom: 'none'}} />
          </>
        }
      />
    </div>
  );
};

/* ---------- flat cards ---------- */

export const Bubble: React.FC<{
  k: number;
  side: 'in' | 'out';
  children: React.ReactNode;
  bg?: string;
  tag?: string;
}> = ({k, side, children, bg, tag}) => (
  <div
    style={{
      alignSelf: side === 'out' ? 'flex-end' : 'flex-start',
      position: 'relative',
      maxWidth: '84%',
      background: bg ?? (side === 'out' ? C.bubbleOut : C.white),
      border: `3px solid ${C.ink}`,
      borderRadius: 16,
      padding: '12px 16px',
      fontFamily: F.ui,
      fontWeight: 600,
      fontSize: 27,
      lineHeight: 1.25,
      color: C.ink,
      transformOrigin: side === 'out' ? '100% 100%' : '0% 100%',
      transform: `scale(${0.4 + 0.6 * k}) translateY(${(1 - k) * 20}px)`,
      opacity: clamp01(k * 3),
      boxShadow: `0 4px 0 ${C.ink}`,
    }}
  >
    {tag && (
      <div style={{position: 'absolute', right: 10, top: -14, background: C.teal, color: C.white, fontFamily: F.label, fontSize: 13, padding: '3px 8px', borderRadius: 8}}>{tag}</div>
    )}
    {children}
  </div>
);

/** Phone showing the pharmacy's WhatsApp; `scroll` shifts the thread up. */
export const Phone: React.FC<{w: number; h: number; children: React.ReactNode; scroll?: number}> = ({w, h, children, scroll = 0}) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      height: h,
      borderRadius: 48,
      background: '#1C1B2B',
      padding: 14,
      boxSizing: 'border-box',
      boxShadow: `14px 0 0 #0F0E1A, 0 30px 40px ${C.shadow}`,
    }}
  >
    <div style={{width: '100%', height: '100%', borderRadius: 36, background: C.chat, overflow: 'hidden', position: 'relative'}}>
      <div style={{height: 92, background: C.teal, display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px 0', boxSizing: 'border-box'}}>
        <div style={{width: 44, height: 44, borderRadius: '50%', background: C.white, color: C.green, fontFamily: F.label, fontSize: 36, lineHeight: '44px', textAlign: 'center'}}>+</div>
        <div style={{fontFamily: F.ui, color: C.white}}>
          <div style={{fontWeight: 700, fontSize: 24}}>Sua Farmácia</div>
          <div style={{fontSize: 16, opacity: 0.75}}>online</div>
        </div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 18, padding: '22px 18px', transform: `translateY(${-scroll}px)`}}>{children}</div>
    </div>
  </div>
);

export const Calendar: React.FC<{n: number; w: number}> = ({n, w}) => (
  <div style={{position: 'absolute', width: w, height: w * 1.05, background: C.white, border: `5px solid ${C.ink}`, borderRadius: 22, boxShadow: `8px 10px 0 ${C.ink}`, overflow: 'hidden'}}>
    <div style={{height: w * 0.28, background: C.red, borderBottom: `5px solid ${C.ink}`}} />
    {[0.28, 0.66].map((x) => (
      <div key={x} style={{position: 'absolute', left: w * x, top: -6, width: w * 0.07, height: w * 0.2, borderRadius: 8, background: C.ink}} />
    ))}
    <div style={{textAlign: 'center', fontFamily: F.label, fontSize: w * 0.42, lineHeight: 1.1, color: C.ink, marginTop: w * 0.06}}>{n}</div>
    <div style={{textAlign: 'center', fontFamily: F.label, fontSize: w * 0.1, color: C.ink}}>DIAS</div>
  </div>
);

/** Paper chip with a green check. */
export const Check: React.FC<{k: number; text: string; size?: number}> = ({k, text, size = 40}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: C.paper,
      border: `4px solid ${C.ink}`,
      borderRadius: 999,
      padding: '12px 30px 12px 14px',
      boxShadow: `0 7px 0 ${C.ink}`,
      fontFamily: F.label,
      fontSize: size,
      color: C.ink,
      transform: `scale(${0.5 + 0.5 * k}) translateY(${(1 - k) * 30}px)`,
      opacity: clamp01(k * 3),
      whiteSpace: 'nowrap',
    }}
  >
    <div style={{width: size * 1.1, height: size * 1.1, borderRadius: '50%', background: C.green, color: C.white, fontSize: size * 0.8, lineHeight: `${size * 1.1}px`, textAlign: 'center'}}>✓</div>
    {text}
  </div>
);

/** Gold R$ coins bursting from (x, y). */
export const Coins: React.FC<{frame: number; at: number; x: number; y: number; n?: number}> = ({frame, at, x, y, n = 16}) => {
  const t = since(frame, at);
  if (t < 0 || t > 2.6) return null;
  return (
    <>
      {Array.from({length: n}, (_, i) => {
        const ti = t - i * 0.03;
        if (ti < 0) return null;
        const vx = (rand(i * 3.3) - 0.5) * 900;
        const vy = -900 - rand(i * 5.1) * 700;
        const px = x + vx * ti;
        const py = y + vy * ti + 1500 * ti * ti;
        const size = 60 + rand(i) * 30;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px - size / 2,
              top: py - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, #FFE08A, ${C.gold} 55%, ${C.goldDark})`,
              border: `4px solid ${C.ink}`,
              boxSizing: 'border-box',
              fontFamily: F.label,
              fontSize: size * 0.3,
              color: C.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(${ti * (rand(i) - 0.5) * 900}deg) scaleX(${Math.abs(Math.cos(ti * 6 + i))*0.6+0.4})`,
            }}
          >
            R$
          </div>
        );
      })}
    </>
  );
};

/** In (spring) × out (ease-in) visibility for an element living between two beats. */
export const life = (frame: number, a: number, b: number, cfg = {}) => {
  const k = sp(frame, a, cfg);
  const o = easeOut(clamp01(since(frame, b) / 0.4));
  return {k, o, on: since(frame, a) > -0.01 && since(frame, b) < 0.45};
};

export const ramp = (frame: number, a: number, dur: number) => interpolate(frame / FPS, [a, a + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
