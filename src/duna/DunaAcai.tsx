import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Img, staticFile, useCurrentFrame} from 'remotion';
import {band, clamp01, easeIn, easeInOut, easeOut, FPS, lerp, prog, rand, sp} from '../lib';
import {Grain, Mask} from '../components/primitives';
import {D, DF, DH, DTL, DW, PHOTO, TOPPINGS} from './lib';

const {s1, s2, s3} = DTL;

const useDunaFonts = () => {
  const [handle] = useState(() => delayRender('duna fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 100px Anton'),
      document.fonts.load('800 100px "Baloo 2"'),
      document.fonts.load('600 20px "Inter Variable"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};

/** Magenta silk folds in the corners, like the draft's backgrounds. Drifts a few px per second. */
const Silk: React.FC<{t: number; opacity?: number}> = ({t, opacity = 1}) => {
  const dx = Math.sin(t * 0.6) * 18;
  const dy = Math.cos(t * 0.45) * 14;
  return (
    <svg width={DW} height={DH} style={{position: 'absolute', inset: 0, opacity}}>
      <defs>
        <linearGradient id="silkA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={D.pink} stopOpacity="0.85" />
          <stop offset="1" stopColor={D.pinkDeep} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="silkB" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={D.pink} stopOpacity="0.75" />
          <stop offset="1" stopColor={D.pinkDeep} stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <g transform={`translate(${dx} ${dy})`}>
        <path d="M640,-40 C760,120 900,160 1120,120 L1120,-40 Z" fill="url(#silkA)" />
        <path d="M520,-40 C700,200 860,300 1120,300 L1120,180 C900,220 760,140 640,-40 Z" fill={D.pinkDeep} opacity={0.55} />
        <path d="M560,-40 C720,190 880,270 1120,262" stroke={D.gold} strokeWidth={3} fill="none" opacity={0.55} />
      </g>
      <g transform={`translate(${-dx} ${-dy})`}>
        <path d="M-40,1560 C160,1600 300,1760 360,1960 L-40,1960 Z" fill="url(#silkB)" />
        <path d="M-40,1420 C200,1480 380,1700 470,1960 L360,1960 C300,1760 160,1600 -40,1560 Z" fill={D.pinkDeep} opacity={0.5} />
        <path d="M-40,1470 C190,1520 360,1720 430,1960" stroke={D.gold} strokeWidth={3} fill="none" opacity={0.5} />
      </g>
    </svg>
  );
};

/** Granola-sized specks floating up, deterministic. */
const Specks: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill>
    {Array.from({length: 22}, (_, i) => {
      const x = rand(i) * DW;
      const speed = 18 + rand(i + 40) * 30;
      const y = (((rand(i + 80) * DH - t * speed) % DH) + DH) % DH;
      const r = 3 + rand(i + 120) * 6;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x + Math.sin(t * 0.8 + i) * 10,
            top: y,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? D.gold : D.pink,
            opacity: 0.18 + rand(i + 200) * 0.25,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const Check: React.FC<{k: number; size: number}> = ({k, size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: `4px solid ${k > 0.02 ? D.gold : D.creamDim}`,
      background: k > 0.02 ? D.gold : 'transparent',
      display: 'grid',
      placeItems: 'center',
      flexShrink: 0,
      transform: `scale(${1 + 0.25 * Math.sin(clamp01(k) * Math.PI)})`,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
      <path
        d="M4 12.5 L10 18 L20 6"
        fill="none"
        stroke={D.ink}
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - clamp01(k)}
      />
    </svg>
  </div>
);

const Ripple: React.FC<{t: number; at: number; x: number; y: number; size: number}> = ({t, at, x, y, size}) => {
  const k = prog(t, at, at + 0.5, easeOut);
  if (t < at || k >= 1) return null;
  const d = size * (0.4 + 0.9 * k);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - d / 2,
        top: y - d / 2,
        width: d,
        height: d,
        borderRadius: '50%',
        border: `6px solid ${D.cream}`,
        opacity: 0.7 * (1 - k),
      }}
    />
  );
};

// Chips orbit the bowl; positions are chip centers.
const CHIP_POS = [
  [270, 790],
  [790, 880],
  [285, 1250],
  [800, 1330],
  [540, 1500],
];
const BOWL = {x: 540, y: 1065, d: 720};

const Chips: React.FC<{t: number; frame: number}> = ({t, frame}) => (
  <>
    {TOPPINGS.map((label, i) => {
      const at = s2.chips[i];
      const tap = at + s2.tapDelay;
      const pop = sp(frame, at, {damping: 10, stiffness: 220, mass: 0.7});
      const on = prog(t, tap, tap + 0.3, easeOut);
      const suck = prog(t, s2.exit + i * 0.05, s2.exit + 0.4 + i * 0.05, easeIn);
      const [cx, cy] = CHIP_POS[i];
      const x = lerp(cx, BOWL.x, suck);
      const y = lerp(cy, BOWL.y, suck);
      if (pop <= 0.001 || suck >= 1) return null;
      return (
        <React.Fragment key={label}>
          <div
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${pop * (1 - suck)}) rotate(${(i % 2 ? 3 : -3) * (1 - on)}deg)`,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              height: 100,
              padding: '0 36px 0 22px',
              borderRadius: 50,
              background: on > 0 ? `rgba(232,41,111,${0.25 + 0.75 * on})` : 'rgba(43,10,27,0.92)',
              border: `4px solid ${D.pink}`,
              boxShadow: `0 14px 40px rgba(0,0,0,0.45), 0 0 ${30 * on}px rgba(255,90,147,${0.6 * on})`,
              whiteSpace: 'nowrap',
            }}
          >
            <Check k={on} size={58} />
            <span style={{fontFamily: DF.display, fontSize: 50, color: D.cream, textTransform: 'uppercase', letterSpacing: '0.02em'}}>
              {label}
            </span>
          </div>
          <Ripple t={t} at={tap - 0.04} x={cx} y={cy} size={180} />
        </React.Fragment>
      );
    })}
  </>
);

/** The photo frame: a card in scene 1, the bowl circle in scene 2, the iris that opens scene 3. */
const Bowl: React.FC<{t: number}> = ({t}) => {
  const morph = prog(t, s2.morph, s2.morphEnd, easeInOut);
  const iris = prog(t, s3.iris, s3.irisEnd, easeInOut);
  const bump = s2.chips.reduce((acc, c) => {
    const dt = t - (c + s2.tapDelay);
    return dt > 0 ? acc + Math.exp(-dt / 0.14) * Math.sin(dt * 34) : acc;
  }, 0);
  const enter = prog(t, 0, 0.9, easeOut);
  const w = lerp(lerp(900, BOWL.d, morph), 2400, iris);
  const h = lerp(lerp(634, BOWL.d, morph), 2400, iris);
  const cx = BOWL.x;
  const cy = lerp(lerp(1150 + (1 - enter) * 60, BOWL.y, morph), DH / 2, iris);
  const radius = lerp(56, w / 2, morph);
  const scale = 1 + 0.025 * bump;
  const zoom = lerp(1.12, 1.0, prog(t, 0, s1.exit, easeOut));
  const photoFade = 1 - band(t, s3.iris + 0.1, s3.irisEnd - 0.1);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - w / 2,
        top: cy - h / 2,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: 'hidden',
        transform: `scale(${scale})`,
        border: `${lerp(10, 0, iris)}px solid ${D.pink}`,
        boxShadow: `0 0 ${lerp(80, 0, iris)}px rgba(232,41,111,0.55), 0 30px 80px rgba(0,0,0,0.5)`,
        background: `radial-gradient(circle at 50% 42%, ${D.wineHi} 0%, ${D.wine} 45%, ${D.bg} 100%)`,
      }}
    >
      <div style={{position: 'absolute', inset: 0, opacity: photoFade}}>
        <Img
          src={staticFile(PHOTO.uva)}
          style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
        />
        <Img
          src={staticFile(PHOTO.banana)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: morph,
            transform: `rotate(${(t - s2.morph) * 2}deg) scale(1.04)`,
          }}
        />
      </div>
    </div>
  );
};

const Title: React.FC<{lines: {text: string; color: string; size: number; k: number}[]; out: number; top: number}> = ({
  lines,
  out,
  top,
}) => (
  <div
    style={{
      position: 'absolute',
      left: 90,
      top,
      transform: 'rotate(-5deg) skewX(-6deg)',
      transformOrigin: '0 0',
      fontFamily: DF.display,
      textTransform: 'uppercase',
      lineHeight: 0.98,
      letterSpacing: '0.005em',
      textShadow: '0 10px 30px rgba(0,0,0,0.45)',
    }}
  >
    {lines.map((l) => (
      <div key={l.text} style={{fontSize: l.size, color: l.color}}>
        <Mask k={l.k} out={out}>
          {l.text}
        </Mask>
      </div>
    ))}
  </div>
);

const Swoosh: React.FC<{k: number; out: number; x: number; y: number; w: number; color: string}> = ({k, out, x, y, w, color}) => (
  <svg
    width={w + 40}
    height={80}
    style={{position: 'absolute', left: x, top: y, transform: 'rotate(-5deg)', opacity: 1 - out, overflow: 'visible'}}
  >
    <path
      d={`M10,60 C${w * 0.3},20 ${w * 0.7},14 ${w},26`}
      fill="none"
      stroke={color}
      strokeWidth={12}
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - k}
    />
  </svg>
);

const Scene1: React.FC<{t: number}> = ({t}) => {
  const out = prog(t, s1.exit, s1.exit + 0.4, easeIn);
  if (out >= 1) return null;
  return (
    <>
      <Title
        top={270}
        out={out}
        lines={[
          {text: 'Deu', color: D.pink, size: 240, k: prog(t, s1.deu, s1.deu + 0.8, easeOut)},
          {text: 'vontade?', color: D.gold, size: 210, k: prog(t, s1.vontade, s1.vontade + 0.8, easeOut)},
        ]}
      />
      <Swoosh k={prog(t, s1.swoosh, s1.swoosh + 0.5, easeOut)} out={out} x={150} y={740} w={560} color={D.pink} />
    </>
  );
};

const Scene2: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const out = prog(t, s2.exit, s2.exit + 0.4, easeIn);
  if (t < s2.title[0] - 0.05) return null;
  return (
    <>
      {out < 1 && (
        <>
          <Title
            top={250}
            out={out}
            lines={[
              {text: 'Monte do seu', color: D.pink, size: 150, k: prog(t, s2.title[0], s2.title[0] + 0.8, easeOut)},
              {text: 'jeito', color: D.gold, size: 210, k: prog(t, s2.title[1], s2.title[1] + 0.8, easeOut)},
            ]}
          />
          <Swoosh k={prog(t, s2.title[1] + 0.45, s2.title[1] + 0.95, easeOut)} out={out} x={110} y={630} w={400} color={D.gold} />
        </>
      )}
      <Chips t={t} frame={frame} />
    </>
  );
};

const WhatsIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      d="M24 5 C13.5 5 5 13.2 5 23.4 C5 27.2 6.2 30.7 8.2 33.6 L6 42.5 L15.4 40 C18 41.3 20.9 42 24 42 C34.5 42 43 33.8 43 23.5 C43 13.2 34.5 5 24 5 Z"
      fill="none"
      stroke={D.cream}
      strokeWidth={3.4}
      strokeLinejoin="round"
    />
    <path
      d="M17.5 15.5 C16.5 15.5 15 16.6 15 18.8 C15 22.8 19.6 28.6 24.8 31.4 C27.4 32.8 30.5 33.4 31.8 31.6 L32.8 30.1 C33.2 29.5 33 28.8 32.4 28.5 L28.6 26.6 C28 26.3 27.4 26.5 27 27 L25.9 28.4 C23.6 27.4 21.4 25.2 20.3 22.9 L21.6 21.6 C22.1 21.1 22.2 20.5 21.9 19.9 L20.1 16.2 C19.8 15.8 19.4 15.5 18.9 15.5 Z"
      fill={D.cream}
    />
  </svg>
);

const Scene3: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  if (t < s3.iris) return null;
  const logo = sp(frame, s3.logo, {damping: 8, stiffness: 200});
  const acai = prog(t, s3.acai, s3.acai + 0.7, easeOut);
  const tag = prog(t, s3.tagline, s3.tagline + 0.7, easeOut);
  const cta = sp(frame, s3.cta, {damping: 11, stiffness: 210, mass: 0.7});
  const handle = prog(t, s3.handle, s3.handle + 0.6, easeOut);
  const press = t > s3.tap ? Math.exp(-(t - s3.tap) / 0.12) * Math.sin((t - s3.tap) * 26) : 0;
  const breathe = 1 + 0.015 * Math.sin((t - s3.cta) * 3.2) * band(t, s3.tap + 0.6, s3.tap + 1.2);
  const glow = band(t, s3.irisEnd - 0.2, s3.irisEnd + 0.6);
  return (
    <>
      <Silk t={t} opacity={glow} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 30% at 50% 36%, rgba(232,41,111,${0.22 * glow}) 0%, rgba(232,41,111,0) 70%)`,
        }}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center'}}>
        <div
          style={{
            fontFamily: DF.logo,
            fontWeight: 800,
            fontSize: 330,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: D.pink,
            transform: `scale(${0.55 + 0.45 * logo})`,
            opacity: clamp01(logo * 3),
            textShadow: `0 0 60px rgba(232,41,111,0.45)`,
          }}
        >
          duna
        </div>
        <div style={{fontFamily: DF.display, fontSize: 92, color: D.gold, letterSpacing: '0.55em', marginTop: -20, paddingLeft: '0.55em'}}>
          <Mask k={acai}>AÇAÍ</Mask>
        </div>
        <div
          style={{
            fontFamily: DF.sans,
            fontWeight: 650,
            fontSize: 34,
            color: D.gold,
            letterSpacing: '0.26em',
            marginTop: 26,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 20}px)`,
          }}
        >
          FEITO PRA DAR VONTADE.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 1260,
          transform: `translate(-50%, -50%) scale(${cta * (1 - 0.05 * press) * breathe})`,
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          height: 156,
          padding: '0 60px 0 30px',
          borderRadius: 78,
          background: D.gold,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(244,194,79,0.35)`,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{width: 104, height: 104, borderRadius: '50%', background: D.pink, display: 'grid', placeItems: 'center'}}>
          <WhatsIcon size={64} />
        </div>
        <span style={{fontFamily: DF.display, fontSize: 70, color: D.ink, textTransform: 'uppercase', letterSpacing: '0.01em'}}>
          Peça pelo WhatsApp
        </span>
      </div>
      <Ripple t={t} at={s3.tap - 0.04} x={540} y={1260} size={420} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1390,
          textAlign: 'center',
          fontFamily: DF.sans,
          fontWeight: 600,
          fontSize: 42,
          color: D.creamDim,
          opacity: handle,
          transform: `translateY(${(1 - handle) * 16}px)`,
        }}
      >
        @duna.acai
      </div>
    </>
  );
};

export const DunaAcai: React.FC = () => {
  useDunaFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: D.bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${D.wine} 0%, ${D.bg} 100%)`}} />
      <Silk t={t} />
      <Specks t={t} />
      <Bowl t={t} />
      <Scene1 t={t} />
      <Scene2 t={t} frame={frame} />
      <Scene3 t={t} frame={frame} />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)'}}
      />
      <Grain frame={frame} opacity={0.07} />
    </AbsoluteFill>
  );
};
