import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog, rand} from '../lib';
import {cap, FF, IMG, P, PHARMA, scene} from './lib';
import {BeforeTile, FeedScreen, PHARMA_BRAND, PHARMA_GRID, PharmaTile, Profile} from './posts';
import {Abs, Bg, Box, BOX_RATIO, Calendar, Chip, DemoTag, Glow, Hand, Headline, Kicker, life, Phone} from './ui';

type SP = {t: number};

/** Warm surface with a soft light pool, the base of the "in the store" shots. */
const Surface: React.FC<{t: number; edge?: number; color?: string; top?: string}> = ({t, edge = 1240, color = P.sand2, top = P.sand}) => (
  <AbsoluteFill style={{background: top}}>
    <Glow x={540 + Math.sin(t * 0.3) * 30} y={edge - 360} r={720} o={0.55} />
    <div style={{position: 'absolute', left: 0, right: 0, top: edge, bottom: 0, background: color}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: edge, height: 6, background: 'rgba(255,255,255,0.45)'}} />
  </AbsoluteFill>
);

/** Top-down counter: one hand hands a product to another. `k` 0..1 drives the exchange. */
const Handoff: React.FC<{t: number; a: number}> = ({t, a}) => {
  const reach = prog(t, a, a + 1.1, easeInOut);
  const give = prog(t, a + 1.2, a + 1.8, easeInOut);
  const staffY = lerp(330, 760, reach) - 120 * give;
  const custY = lerp(1700, 1260, prog(t, a + 0.3, a + 1.3, easeOut)) + 40 * give;
  const boxY = lerp(staffY + 150, custY - 210, give);
  return (
    <AbsoluteFill style={{background: P.sand2}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 560, background: P.sand3}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 552, height: 16, background: 'rgba(0,0,0,0.08)'}} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 640 + i * 150, height: 2, background: 'rgba(255,255,255,0.22)'}} />
      ))}
      <Abs x={110} y={760} style={{transform: 'rotate(-8deg)'}}>
        <svg width={230} height={280} viewBox="0 0 230 280">
          <path d="M20 40 L210 40 L222 270 L8 270 Z" fill="#C7A77E" />
          <path d="M20 40 L210 40 L206 70 L24 70 Z" fill="#B4936A" />
          <path d="M80 40 Q80 0 115 0 Q150 0 150 40" stroke="#8C6F4E" strokeWidth={8} fill="none" />
        </svg>
      </Abs>
      <Abs x={780} y={1020} style={{transform: 'rotate(10deg)'}}>
        <div style={{width: 170, height: 250, borderRadius: 24, background: P.graphite, boxShadow: `0 16px 30px ${P.shadow}`}}>
          <div style={{margin: 18, height: 80, borderRadius: 10, background: '#3E5C52'}} />
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, margin: '0 18px'}}>
            {Array.from({length: 9}, (_, i) => (
              <div key={i} style={{height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.18)'}} />
            ))}
          </div>
        </div>
      </Abs>
      <Hand x={560} y={custY} rot={-4} s={1.9} curl={0.15 + 0.5 * give} skin={P.skinA} skinDark={P.skinADark} sleeve={P.sleeveA} />
      <Hand x={520} y={staffY} rot={180} s={1.9} curl={0.6 - 0.4 * give} skin={P.skinB} skinDark={P.skinBDark} sleeve="#F4F4F2" />
      <Abs x={540 - 160} y={boxY - 105} style={{transform: `rotate(${lerp(-6, 4, give)}deg)`}}>
        <Box src={IMG.aroeira} w={320} ratio={BOX_RATIO.aroeira} />
      </Abs>
    </AbsoluteFill>
  );
};

export const S1: React.FC<SP> = ({t}) => {
  const s = scene('s1');
  const handAt = cap('s1', 1) - 0.1;
  const phoneAt = cap('s1', 2) - 0.25;
  const hero = 1 - prog(t, handAt, handAt + 0.5, easeIn);
  const hand = prog(t, handAt, handAt + 0.5, easeOut) * (1 - prog(t, phoneAt, phoneAt + 0.5, easeIn));
  const push = 1 + 0.06 * prog(t, s.start, handAt + 0.5, (x) => x);
  const phoneK = prog(t, phoneAt, phoneAt + 0.9, easeOut);
  const head = cap('s1', 3);
  const lift = prog(t, head - 0.2, head + 0.6, easeInOut);
  return (
    <AbsoluteFill>
      {hero > 0 && (
        <AbsoluteFill style={{opacity: hero}}>
          <Surface t={t} edge={1180} />
          <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 60%'}}>
            {(['d3', 'artro', 'k2'] as const).map((k, i) => {
              const w = [270, 330, 400][i];
              const x = [70, 680, 330][i];
              const h = w * BOX_RATIO[k];
              const floor = [1150, 1150, 1290][i];
              return (
                <Abs key={k} x={x} y={floor - h} style={{zIndex: i}}>
                  <Box src={IMG[k]} w={w} ratio={BOX_RATIO[k]} light={prog(t, 0.3 + i * 0.25, 2.4 + i * 0.25, easeInOut)} />
                </Abs>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {hand > 0 && (
        <AbsoluteFill style={{opacity: hand, transform: `scale(${1.04 - 0.04 * hand})`}}>
          <Handoff t={t} a={handAt} />
        </AbsoluteFill>
      )}
      {phoneK > 0 && (
        <AbsoluteFill style={{opacity: clamp01(phoneK * 1.6)}}>
          <Surface t={t} edge={1500} />
          <Phone x={540} y={lerp(1250, lerp(860, 940, lift), phoneK)} w={400} rot={lerp(8, 0, phoneK)} scale={lerp(1.12, 1, lift)}>
            <FeedScreen w={372} brand={PHARMA_BRAND}>
              <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + 0.05 * prog(t, phoneAt, s.end, (x) => x)})`}}>
                <PharmaTile kind="calcium" w={372} />
              </div>
            </FeedScreen>
          </Phone>
          <Abs x={540} y={1352} style={{transform: 'translateX(-50%)', opacity: phoneK}}>
            <DemoTag />
          </Abs>
          <Abs x={90} y={236} w={900}>
            <Headline t={t} at={head} lines={['A qualidade', 'do seu negócio', 'precisa aparecer.']} size={88} accent={['aparecer']} />
          </Abs>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S2: the routine */

const Shelf: React.FC<{t: number; a: number}> = ({t, a}) => {
  const rows: (keyof typeof BOX_RATIO)[][] = [
    ['k2', 'artro', 'd3', 'k2'],
    ['aroeira', 'sulfuroso'],
  ];
  return (
    <div style={{position: 'absolute', left: 90, top: 560, width: 900, height: 720}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: P.white, boxShadow: `0 30px 70px ${P.shadow}`}} />
      {[0, 1].map((r) => (
        <div key={r} style={{position: 'absolute', left: 30, right: 30, top: 300 + r * 340, height: 18, borderRadius: 6, background: P.sand2}} />
      ))}
      {rows.map((row, r) =>
        row.map((k, i) => {
          const at = a + (r * 4 + i) * 0.22;
          const k1 = prog(t, at, at + 0.7, easeOut);
          const w = r === 0 ? 170 : 330;
          const h = w * BOX_RATIO[k];
          const x = r === 0 ? 60 + i * 200 : 70 + i * 400;
          return (
            <div key={`${r}${i}`} style={{position: 'absolute', left: x + (1 - k1) * 60, top: 300 + r * 340 - h, opacity: k1}}>
              <Box src={IMG[k]} w={w} ratio={BOX_RATIO[k]} />
            </div>
          );
        }),
      )}
    </div>
  );
};

const TaskRow: React.FC<{label: string; k: number; w: number}> = ({label, k, w}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: w * 0.04,
      padding: `${w * 0.035}px ${w * 0.05}px`,
      margin: `0 ${w * 0.05}px ${w * 0.03}px`,
      borderRadius: w * 0.04,
      background: P.cream,
      opacity: clamp01(k * 2),
      transform: `translateY(${(1 - k) * 20}px)`,
    }}
  >
    <div
      style={{
        width: w * 0.08,
        height: w * 0.08,
        borderRadius: '50%',
        background: k > 0.6 ? PHARMA.green : 'transparent',
        border: `${w * 0.008}px solid ${PHARMA.green}`,
        display: 'grid',
        placeItems: 'center',
        color: P.white,
        fontSize: w * 0.05,
        fontWeight: 800,
      }}
    >
      {k > 0.6 ? '✓' : ''}
    </div>
    <div style={{fontFamily: FF.sans, fontSize: w * 0.068, fontWeight: 600}}>{label}</div>
  </div>
);

export const S2: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s2', i);
  const s = scene('s2');
  const phoneK = prog(t, c(1) - 0.3, c(1) + 0.5, easeOut);
  const later = prog(t, c(2) + 0.2, c(2) + 0.6, easeInOut);
  const calAt = c(3) - 0.3;
  const routine = 1 - prog(t, calAt, calAt + 0.45, easeIn);
  const calK = prog(t, calAt + 0.1, calAt + 0.9, easeOut);
  const fillAt = c(4) - 0.1;
  const pw = 400;
  return (
    <AbsoluteFill>
      <Bg color={P.cream} />
      {routine > 0 && (
        <AbsoluteFill style={{opacity: routine}}>
          <Abs x={90} y={250}>
            <Kicker k={prog(t, s.start + 0.3, s.start + 1, easeOut)}>O dia a dia</Kicker>
          </Abs>
          <Shelf t={t} a={c(0) - 0.4} />
          <Phone x={790} y={lerp(1700, 930, phoneK)} w={pw} rot={-7} opacity={clamp01(phoneK * 2)}>
            <div style={{position: 'absolute', inset: 0, background: P.white, paddingTop: pw * 0.22}}>
              <div style={{opacity: 1 - later}}>
                <div style={{fontFamily: FF.sans, fontWeight: 750, fontSize: pw * 0.075, margin: `0 ${pw * 0.06}px ${pw * 0.05}px`}}>Hoje</div>
                {['Pedido separado', 'Estoque conferido', 'Entrega às 14h', 'Fechar o caixa'].map((l, i) => (
                  <TaskRow key={l} label={l} w={pw * 0.93} k={prog(t, c(1) + 0.2 + i * 0.3, c(1) + 0.6 + i * 0.3, easeOut)} />
                ))}
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: pw * 0.5, opacity: later, transform: `translateY(${(1 - later) * 30}px)`, textAlign: 'center', fontFamily: FF.sans}}>
                <div style={{width: pw * 0.5, height: pw * 0.5, margin: '0 auto', borderRadius: pw * 0.06, border: `${pw * 0.012}px dashed ${P.sand3}`, display: 'grid', placeItems: 'center', fontSize: pw * 0.2, color: P.sand3}}>+</div>
                <div style={{fontWeight: 700, fontSize: pw * 0.07, marginTop: pw * 0.08}}>Publicar hoje?</div>
                <div style={{display: 'flex', justifyContent: 'center', gap: pw * 0.04, marginTop: pw * 0.06}}>
                  <div style={{padding: `${pw * 0.03}px ${pw * 0.07}px`, borderRadius: 99, background: P.sand, fontSize: pw * 0.05, fontWeight: 600}}>Agora</div>
                  <div
                    style={{
                      padding: `${pw * 0.03}px ${pw * 0.07}px`,
                      borderRadius: 99,
                      background: P.ink,
                      color: P.cream,
                      fontSize: pw * 0.05,
                      fontWeight: 600,
                      transform: `scale(${1 - 0.06 * Math.sin(prog(t, c(2) + 1.0, c(2) + 1.3, (x) => x) * Math.PI)})`,
                    }}
                  >
                    Depois
                  </div>
                </div>
              </div>
            </div>
          </Phone>
        </AbsoluteFill>
      )}
      {calK > 0 && (
        <AbsoluteFill style={{opacity: clamp01(calK * 1.5)}}>
          <Abs x={90} y={250} w={900}>
            <Headline t={t} at={c(3)} out={fillAt} lines={['Seu negócio tem', 'o que mostrar.']} size={88} />
          </Abs>
          <Abs x={90} y={250} w={900}>
            <Headline t={t} at={fillAt + 0.15} lines={['Falta organizar essa', 'comunicação.']} size={78} accent={['organizar']} />
          </Abs>
          <Abs x={90} y={lerp(640, 560, calK)}>
            <Calendar
              w={900}
              fill={(d) => (d % 7 === 1 || d % 7 === 3 || d % 7 === 5 ? prog(t, fillAt + 0.4 + d * 0.04, fillAt + 0.7 + d * 0.04, easeOut) : 0)}
              color={(d) => (d % 7 === 3 ? P.ink : d % 7 === 5 ? P.sand3 : P.accent)}
            />
          </Abs>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S3: who we are */

const ShotList: React.FC<{t: number; a: number}> = ({t, a}) => (
  <div style={{width: 420, padding: 34, background: P.white, borderRadius: 10, boxShadow: `0 20px 40px ${P.shadow}`, fontFamily: FF.sans, transform: 'rotate(-5deg)'}}>
    <div style={{fontWeight: 750, fontSize: 34, marginBottom: 20}}>Roteiro da sessão</div>
    {['Prateleira', 'Rótulos em detalhe', 'Balcão', 'Equipe'].map((l, i) => {
      const k = prog(t, a + i * 0.55, a + i * 0.55 + 0.3, easeOut);
      return (
        <div key={l} style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, padding: '10px 0', borderTop: `2px solid ${P.inkFaint}`}}>
          <svg width={34} height={34} viewBox="0 0 24 24">
            <rect x={2} y={2} width={20} height={20} rx={5} fill="none" stroke={P.ink} strokeWidth={2} />
            <path d="M6 12.5 L10 16 L18 7" fill="none" stroke={P.accent} strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
          </svg>
          <span style={{opacity: 0.85}}>{l}</span>
        </div>
      );
    })}
  </div>
);

/** Phone on a small tripod, seen from above, lens toward the product. */
const TripodPhone: React.FC<{x: number; y: number; rot: number}> = ({x, y, rot}) => (
  <Abs x={x} y={y} style={{transform: `rotate(${rot}deg)`}}>
    <svg width={260} height={420} viewBox="0 0 260 420" style={{overflow: 'visible', filter: 'drop-shadow(0 16px 16px rgba(28,29,31,0.25))'}}>
      {[-30, 90, 210].map((a, i) => (
        <line key={i} x1={130} y1={250} x2={130 + Math.cos((a * Math.PI) / 180) * 150} y2={250 + Math.sin((a * Math.PI) / 180) * 150} stroke={P.graphite3} strokeWidth={14} strokeLinecap="round" />
      ))}
      <circle cx={130} cy={250} r={28} fill={P.graphite} />
      <rect x={60} y={20} width={140} height={290} rx={26} fill={P.graphite} />
      <rect x={70} y={30} width={120} height={270} rx={20} fill={P.graphite2} />
      <circle cx={100} cy={60} r={14} fill="#111" stroke="#555" strokeWidth={3} />
      <circle cx={100} cy={96} r={14} fill="#111" stroke="#555" strokeWidth={3} />
    </svg>
  </Abs>
);

export const S3: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s3', i);
  const plan = c(3) - 0.2;
  const ident = c(3) + 1.25;
  const post = c(4) - 0.1;
  const tableK = 1 - prog(t, plan, plan + 0.5, easeIn);
  const boardK = prog(t, plan + 0.1, plan + 0.8, easeOut);
  const duo = prog(t, c(1) - 0.2, c(1) + 0.9, easeOut);
  const place = prog(t, c(0) - 0.4, c(0) + 0.9, easeOut);
  const words = [
    {w: 'Planejamento.', at: plan + 0.1},
    {w: 'Identidade.', at: ident},
    {w: 'Conteúdo com constância.', at: post},
  ];
  return (
    <AbsoluteFill>
      <Bg color={P.sand2}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 180 + i * 260, height: 2, background: 'rgba(255,255,255,0.25)'}} />
        ))}
      </Bg>
      {tableK > 0 && (
        <AbsoluteFill style={{opacity: tableK}}>
          <Abs x={90} y={250}>
            <Kicker k={prog(t, c(0), c(0) + 0.8, easeOut)}>Nossa equipe</Kicker>
          </Abs>
          <Abs x={60} y={880}>
            <ShotList t={t} a={c(0) + 0.6} />
          </Abs>
          <Abs x={520} y={lerp(980, 940, place)} style={{transform: `rotate(${lerp(14, 6, place)}deg)`}}>
            <Box src={IMG.sulfuroso} w={360} ratio={BOX_RATIO.sulfuroso} />
          </Abs>
          <Hand x={lerp(1250, 1010, place) - 20 * prog(t, c(1) + 0.4, c(1) + 1.2, easeInOut)} y={lerp(1180, 1080, place)} rot={-70} s={1.6} curl={0.55} skin={P.skinB} skinDark={P.skinBDark} sleeve={P.sleeveB} />
          <div style={{opacity: duo}}>
            <TripodPhone x={560} y={lerp(140, 380, duo)} rot={180} />
            <Hand x={lerp(-160, 250, duo)} y={560} rot={110} s={1.6} curl={0.7} skin={P.skinA} skinDark={P.skinADark} sleeve={P.sleeveA} />
          </div>
          <Hand x={lerp(-200, 90, prog(t, c(0) + 1.2, c(0) + 2.0, easeOut))} y={1340} rot={60} s={1.5} curl={0.2} skin={P.skinA} skinDark={P.skinADark} sleeve={P.sleeveA} />
        </AbsoluteFill>
      )}
      {boardK > 0 && (
        <AbsoluteFill style={{opacity: boardK}}>
          <Abs x={90} y={250}>
            {words.map((w, i) => {
              const k = prog(t, w.at, w.at + 0.7, easeOut);
              return (
                <div
                  key={w.w}
                  style={{
                    fontFamily: FF.sans,
                    fontWeight: 760,
                    fontSize: 74,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.12,
                    color: i === 2 ? P.accent : P.ink,
                    opacity: k,
                    transform: `translateY(${(1 - k) * 30}px)`,
                  }}
                >
                  {w.w}
                </div>
              );
            })}
          </Abs>
          <Abs x={70} y={lerp(700, 640, boardK)} style={{transform: 'rotate(-3deg)'}}>
            <Calendar
              w={560}
              fill={(d) => (d % 7 === 1 || d % 7 === 4 ? prog(t, plan + 0.5 + d * 0.035, plan + 0.8 + d * 0.035, easeOut) : 0)}
              color={(d) => (d % 7 === 4 ? PHARMA.green : P.accent)}
            />
          </Abs>
          <Abs x={660} y={600}>
            {[PHARMA.green, PHARMA.mint, P.cream, P.ink].map((col, i) => {
              const k = prog(t, ident + i * 0.12, ident + 0.5 + i * 0.12, easeOut);
              return (
                <div
                  key={col}
                  style={{
                    position: 'absolute',
                    left: i * 70,
                    top: i * 16,
                    width: 150,
                    height: 210,
                    borderRadius: 14,
                    background: P.white,
                    boxShadow: `0 14px 28px ${P.shadow}`,
                    transform: `rotate(${-8 + i * 6}deg) translateY(${(1 - k) * 80}px)`,
                    opacity: k,
                    padding: 12,
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{height: 140, borderRadius: 8, background: col, border: `1px solid ${P.inkFaint}`}} />
                  <div style={{height: 10, width: '70%', background: P.inkFaint, borderRadius: 9, marginTop: 14}} />
                </div>
              );
            })}
            <div
              style={{
                position: 'absolute',
                left: 40,
                top: 300,
                fontFamily: FF.sans,
                fontWeight: 800,
                fontSize: 150,
                letterSpacing: '-0.05em',
                color: PHARMA.green,
                opacity: prog(t, ident + 0.4, ident + 1, easeOut),
              }}
            >
              Aa
            </div>
          </Abs>
          <Abs x={70} y={1352} style={{opacity: prog(t, post + 0.6, post + 1.2, easeOut)}}>
            <DemoTag />
          </Abs>
          <Abs x={70} y={1110}>
            <div style={{display: 'flex', gap: 22}}>
              {(['calcium', 'aroeira', 'team', 'shelf'] as const).map((k, i) => {
                const kk = prog(t, post + 0.2 + i * 0.22, post + 0.8 + i * 0.22, easeOut);
                return (
                  <div key={k} style={{width: 214, height: 214, position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: `0 14px 28px ${P.shadow}`, opacity: kk, transform: `translateY(${(1 - kk) * 60}px)`}}>
                    <PharmaTile kind={k} w={214} />
                  </div>
                );
              })}
            </div>
          </Abs>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S4: the transformation */

export const S4: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s4', i);
  const s = scene('s4');
  const flipAt = c(1);
  const zoomAt = c(4) - 0.2;
  const unityAt = c(5) - 0.2;
  const calAt = c(6) - 0.2;
  const pw = 400;
  const sw = pw * 0.93;
  const tileFlip = (i: number) => prog(t, flipAt + 0.2 + i * 0.32, flipAt + 0.75 + i * 0.32, easeInOut);
  const zoom = prog(t, zoomAt, zoomAt + 0.7, easeOut) * (1 - prog(t, unityAt, unityAt + 0.5, easeIn));
  const calK = prog(t, calAt, calAt + 0.8, easeOut);
  const header = prog(t, flipAt + 1.8, flipAt + 2.6, easeInOut);
  const lines: [number, number, string[], string[]][] = [
    [c(0), zoomAt, ['Nós agregamos', 'valor à imagem', 'do seu negócio.'], ['valor']],
    [zoomAt + 0.15, unityAt, ['Mais cuidado na', 'apresentação.'], ['cuidado']],
    [unityAt + 0.15, calAt, ['Mais unidade', 'para sua marca.'], ['unidade']],
    [calAt + 0.15, s.end + 1, ['Mais organização', 'para sua rotina.'], ['organização']],
  ];
  return (
    <AbsoluteFill>
      <Bg color={P.cream} />
      {lines.map(([a, b, ln, acc], i) => (
        <Abs key={i} x={90} y={250} w={900}>
          <Headline t={t} at={a} out={b} lines={ln} size={82} accent={acc} />
        </Abs>
      ))}
      <Phone x={lerp(540, 380, calK)} y={930} w={pw} rot={-4 * calK} scale={1 - 0.1 * calK}>
        <Profile
          w={sw}
          brand={header > 0.5 ? PHARMA_BRAND : {...PHARMA_BRAND, handle: 'sua.loja', name: 'Sua Loja', avatar: <div style={{width: 200, height: 200, background: '#CFCFCF'}} />, bio: ['Bem-vindos!'], hl: [{label: 'Promo', color: '#F1D7DF'}, {label: 'Fotos', color: '#B9E4F0'}, {label: 'Avisos', color: '#FFF6D6'}, {label: 'Loja', color: '#DCDCDC'}], accent: '#CCCCCC'}}
          headerK={1 - 0.6 * Math.sin(header * Math.PI)}
          tile={(i, size) => {
            const f = tileFlip(i);
            return (
              <div style={{position: 'absolute', inset: 0, transform: `perspective(600px) rotateY(${f < 0.5 ? f * 180 : (f - 1) * 180}deg)`}}>
                {f < 0.5 ? <BeforeTile i={i} w={size} /> : <PharmaTile kind={PHARMA_GRID[i]} w={size} />}
              </div>
            );
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(28,29,31,${0.45 * zoom})`,
          }}
        />
      </Phone>
      {zoom > 0 && (
        <Abs x={540 - 300} y={lerp(1060, 700, zoom)} style={{opacity: zoom, transform: `scale(${0.6 + 0.4 * zoom})`}}>
          <div style={{width: 600, height: 600, position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: `0 40px 80px rgba(0,0,0,0.35)`}}>
            <PharmaTile kind="calcium" w={600} />
          </div>
        </Abs>
      )}
      {calK > 0 && (
        <Abs x={lerp(1080, 470, calK)} y={760} style={{transform: 'rotate(3deg)'}}>
          <Calendar w={560} fill={(d) => (d % 7 === 1 || d % 7 === 3 || d % 7 === 5 ? prog(t, calAt + 0.3 + d * 0.03, calAt + 0.6 + d * 0.03, easeOut) : 0)} color={(d) => (d % 7 === 3 ? PHARMA.mint : PHARMA.green)} />
        </Abs>
      )}
      <Abs x={540} y={1352} style={{transform: 'translateX(-50%)', opacity: prog(t, flipAt + 1, flipAt + 1.6, easeOut) * (1 - zoom)}}>
        <DemoTag />
      </Abs>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S5: one look per business */

export const Segment: React.FC<{t: number; a: number; b: number; children: React.ReactNode}> = ({t, a, b, children}) => {
  const k = life(t, a, b, 0.55, 0.35);
  if (k <= 0) return null;
  return <AbsoluteFill style={{opacity: k, transform: `translateY(${(1 - prog(t, a, a + 0.7, easeOut)) * 60}px)`}}>{children}</AbsoluteFill>;
};

export const rnd = rand;
