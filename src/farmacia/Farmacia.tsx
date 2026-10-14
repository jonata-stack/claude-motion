import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {easeOut, prog} from '../lib';
import {Grain} from '../components/primitives';
import {FF, FFPS, P, SceneId, VT} from './lib';
import {S1, S2, S3, S4} from './scenes1';
import {S5, S6, S7, S8, S9, S10} from './scenes2';

const SCENES: [SceneId, React.FC<{t: number}>][] = [
  ['s1', S1],
  ['s2', S2],
  ['s3', S3],
  ['s4', S4],
  ['s5', S5],
  ['s6', S6],
  ['s7', S7],
  ['s8', S8],
  ['s9', S9],
  ['s10', S10],
];
const XFADE = 0.6;

const useFarmaciaFonts = () => {
  const [handle] = useState(() => delayRender('farmacia fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 100px "Inter Variable"'),
      document.fonts.load('800 100px "Inter Variable"'),
      document.fonts.load('400 100px "Instrument Serif"'),
      document.fonts.load('600 20px "JetBrains Mono"'),
      document.fonts.load('400 100px Anton'),
      document.fonts.load('800 100px "Baloo 2"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};

const ALL_CAPS = Object.values(VT.scenes).flatMap((s) => s.captions);

/** Narration captions: one chunk at a time, max two lines, above the bottom UI zone. */
const Captions: React.FC<{t: number}> = ({t}) => {
  const i = ALL_CAPS.findIndex((c, j) => {
    const next = ALL_CAPS[j + 1];
    const until = next ? Math.min(c.t1 + 0.35, next.t0 - 0.02) : c.t1 + 0.6;
    return t >= c.t0 - 0.06 && t < until;
  });
  if (i < 0) return null;
  const c = ALL_CAPS[i];
  const k = prog(t, c.t0 - 0.06, c.t0 + 0.12, easeOut);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1410, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          maxWidth: 940,
          padding: '16px 30px 18px',
          borderRadius: 22,
          background: 'rgba(28,29,31,0.86)',
          color: P.cream,
          fontFamily: FF.sans,
          fontSize: 44,
          fontWeight: 600,
          lineHeight: 1.22,
          letterSpacing: '-0.01em',
          textAlign: 'center',
          opacity: k,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        }}
      >
        {c.text}
      </div>
    </div>
  );
};

export const Farmacia: React.FC = () => {
  useFarmaciaFonts();
  const frame = useCurrentFrame();
  const t = frame / FFPS;
  return (
    <AbsoluteFill style={{background: P.graphite}}>
      {SCENES.map(([id, Scene], i) => {
        const s = VT.scenes[id];
        const nextStart = i < SCENES.length - 1 ? VT.scenes[SCENES[i + 1][0]].start : 1e9;
        if (t < s.start || t > nextStart + XFADE) return null;
        const k = i === 0 ? 1 : prog(t, s.start, s.start + XFADE, easeOut);
        return (
          <AbsoluteFill key={id} style={{opacity: k}}>
            <Scene t={t} />
          </AbsoluteFill>
        );
      })}
      <Captions t={t} />
      <Grain frame={frame} opacity={0.05} />
    </AbsoluteFill>
  );
};
