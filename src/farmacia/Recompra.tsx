import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Grain} from '../components/primitives';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog} from '../lib';
import {
  Bubble,
  Calendar,
  Check,
  City,
  Coins,
  Counter,
  COUNTER_Y,
  Critter,
  Jar,
  Phone,
  Prop,
  Robot,
  Shop,
  TapeLabel,
  Vignette,
  WordTiles,
} from './parts';
import {C, F, FPS, RT, sp} from './theme';
import {useFarmaciaFonts} from './useFarmaciaFonts';

const T = RT;
type Walk = {x: number; lift: number; squash: number};

/** Hop from x0 to x1 starting at t0. */
const walk = (t: number, t0: number, dur: number, x0: number, x1: number, hops = 3): Walk => {
  const p = clamp01((t - t0) / dur);
  const e = easeInOut(p);
  const moving = p > 0 && p < 1;
  const ph = (p * hops) % 1;
  return {
    x: lerp(x0, x1, e),
    lift: moving ? Math.sin(ph * Math.PI) * 38 : 0,
    squash: moving ? Math.cos(ph * Math.PI * 2) * 0.05 : 0,
  };
};

/** Drop in from above with a bouncy landing; returns lift in px and squash. */
const drop = (frame: number, at: number) => {
  const k = sp(frame, at, {damping: 9, stiffness: 200, mass: 0.7});
  const t = frame / FPS - at;
  const land = t > 0.12 && t < 0.4 ? Math.sin(((t - 0.12) / 0.28) * Math.PI) * 0.08 : 0;
  return {lift: (1 - k) * 700, squash: land, on: t > 0};
};

/** Leave: 0 → 1 with ease-in over 0.4 s. */
const leave = (t: number, at: number, d = 0.4) => easeIn(clamp01((t - at) / d));

const pop = (frame: number, at: number) => sp(frame, at, {damping: 10, stiffness: 220, mass: 0.7});

/* ---------- talking head ---------- */

const TALK_W = 880;
const TALK_H = 880;

const Talk: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const range = (T.talk as number[][]).find(([a, b]) => t >= a && t < b);
  if (!range) return null;
  const [a, b] = range;
  const k = a === 0 ? 1 : sp(frame, a, {damping: 15, stiffness: 200, mass: 0.7});
  const settle = a === 0 ? 1 + 0.03 * (1 - prog(t, 0, 0.8, easeOut)) : 1;
  const out = easeIn(clamp01((t - (b - 0.3)) / 0.3));
  // Punch in on "percebe" and "cliente some": also crops the badges burned into the source.
  const early = t < 10;
  const punch = early ? prog(t, 3.42, 3.6, easeOut) : prog(t, 43.8, 44.05, easeOut);
  const pTop = early ? 560 : 510;
  const sc = TALK_W / lerp(950, 1380 - pTop, punch);
  const left = -lerp(65, (1080 - (1380 - pTop)) / 2, punch) * sc;
  const top = -lerp(430, pTop, punch) * sc;
  const drift = Math.sin(t * 0.6) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - TALK_W - 32) / 2,
        top: 380,
        width: TALK_W + 32,
        height: TALK_H + 32,
        background: C.paper,
        padding: 16,
        boxSizing: 'border-box',
        borderRadius: 10,
        boxShadow: `0 12px 0 ${C.paperDark}, 0 40px 60px ${C.shadow}`,
        transform: `translateY(${(1 - k) * 500 + out * 700 + drift}px) rotate(${-1.2 + (1 - k) * 6 + out * 8}deg) scale(${settle * (1 - out * 0.2)})`,
      }}
    >
      <div style={{width: TALK_W, height: TALK_H, overflow: 'hidden', borderRadius: 4, position: 'relative', background: '#000'}}>
        <Sequence from={Math.round(a * FPS)} durationInFrames={Math.round((b - a) * FPS)} layout="none">
          <OffthreadVideo
            src={staticFile('farmacia/fala.mp4')}
            muted
            startFrom={Math.round(a * FPS)}
            style={{position: 'absolute', left, top, width: 1080 * sc, height: 1920 * sc, maxWidth: 'none'}}
          />
        </Sequence>
      </div>
    </div>
  );
};

/* ---------- scenes ---------- */

const MARIA = {s: 250, color: C.blue};
const ATT = {s: 240, color: C.coral};

const Maria: React.FC<{frame: number; w: Walk; mood?: 'ok' | 'lost' | 'happy'; scale?: number}> = ({frame, w, mood = 'ok', scale = 1}) => (
  <Prop x={w.x} w={MARIA.s} h={MARIA.s * 1.06} lift={w.lift} squash={w.squash} scale={scale} ry={-18}>
    <Critter frame={frame} s={MARIA.s} color={MARIA.color} eyes={mood === 'happy' ? 'happy' : 'glasses'} bow mouth={mood === 'lost' ? 'flat' : mood === 'happy' ? 'o' : 'smile'} />
  </Prop>
);

const Atendente: React.FC<{frame: number; w: Walk; scale?: number}> = ({frame, w, scale = 1}) => (
  <Prop x={w.x} w={ATT.s} h={ATT.s * 1.06} lift={w.lift} squash={w.squash} scale={scale} ry={-26}>
    <Critter frame={frame} s={ATT.s} color={ATT.color} eyes="happy" headset seed={2} />
  </Prop>
);

/** 4.4 – 16.5: the client, the formula, forgetting, the competitor. */
const Problem: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  if (t < 4.3 || t > 17.1) return null;
  const s1 = T.s1;
  const s2 = T.s2;
  const s3 = T.s3;
  // Maria: in, then walks to the competitor, then hops off.
  let mw = walk(t, 4.55, 0.8, -160, 300);
  if (t > s3.walk) mw = walk(t, s3.walk, 0.55, 300, 760, 2);
  const mOut = leave(t, s3.exit, 0.45);
  const mood = t > s2.forget && t < s3.walk ? 'lost' : 'ok';
  const jar = drop(frame, s1.jar);
  const fill = 1 - prog(t, s2.drain, s2.drain + 0.8, easeInOut);
  const jarOut = leave(t, s3.worse, 0.35);
  const cal = pop(frame, s1.cal);
  const calOut = leave(t, s2.drain, 0.3);
  const calN = Math.max(1, Math.round(prog(t, s1.cal + 0.1, s1.calNum + 0.2, easeOut) * 30));
  const ask = pop(frame, s2.ask);
  const think = pop(frame, s2.forget);
  const shopK = sp(frame, s3.rival, {damping: 13, stiffness: 160});
  const ourK = sp(frame, s3.worse + 0.1, {damping: 13, stiffness: 160});
  const shopOut = leave(t, s3.exit, 0.4);
  return (
    <>
      {t > s3.worse && (
        <>
          <Prop x={250} baseY={COUNTER_Y - 30} w={300} h={255} ry={-14} scale={Math.max(0.001, ourK * (1 - shopOut))} lift={(1 - ourK) * 200}>
            <Shop w={300} name="SUA FARMÁCIA" color={C.blue} />
          </Prop>
          <Prop x={790} baseY={COUNTER_Y - 30} w={300} h={255} ry={-26} scale={Math.max(0.001, shopK * (1 - shopOut))} lift={(1 - shopK) * 200}>
            <Shop w={300} name="CONCORRENTE" color={C.red} />
          </Prop>
        </>
      )}
      {t > 4.55 && <Maria frame={frame} w={{...mw, x: mw.x - mOut * 700}} mood={mood} />}
      {jar.on && jarOut < 1 && (
        <Prop x={700 + jarOut * 600} w={200} h={275} lift={jar.lift} squash={jar.squash} ry={-24}>
          <Jar s={200} fill={fill} />
        </Prop>
      )}
      {cal > 0 && calOut < 1 && (
        <div style={{position: 'absolute', left: 820, top: 600 - calOut * 500, transform: `scale(${cal}) rotate(${6 - calOut * 20}deg)`}}>
          <Calendar n={calN} w={190} />
        </div>
      )}
      {ask > 0 && t < s3.worse &&
        [
          [580, 800, -8],
          [830, 760, 10],
        ].map(([x, y, r], i) => {
          const k = pop(frame, s2.ask + i * 0.15);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y - Math.sin(t * 3 + i) * 8, width: 90, height: 90, borderRadius: '50%', background: C.white, border: `5px solid ${C.ink}`, boxShadow: `0 6px 0 ${C.ink}`, fontFamily: F.label, fontSize: 56, color: C.red, textAlign: 'center', lineHeight: '84px', transform: `scale(${k}) rotate(${r}deg)`}}>
              ?
            </div>
          );
        })}
      {think > 0 && t < s3.worse + 0.3 && (
        <div style={{position: 'absolute', left: 200, top: 600, transform: `scale(${think * (1 - leave(t, s3.worse, 0.3))})`, transformOrigin: '50% 100%'}}>
          <div style={{width: 230, height: 140, borderRadius: '50%', background: C.white, border: `5px solid ${C.ink}`, boxShadow: `0 6px 0 ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 22, height: 22, borderRadius: '50%', background: C.ink, opacity: 0.25 + 0.75 * clamp01(Math.sin(t * 5 - i * 0.8))}} />
            ))}
          </div>
          <div style={{position: 'absolute', left: 120, top: 150, width: 30, height: 30, borderRadius: '50%', background: C.white, border: `4px solid ${C.ink}`}} />
          <div style={{position: 'absolute', left: 104, top: 190, width: 18, height: 18, borderRadius: '50%', background: C.white, border: `4px solid ${C.ink}`}} />
        </div>
      )}
    </>
  );
};

const typed = (text: string, t: number, at: number) => text.slice(0, Math.max(0, Math.floor((t - at) / 0.06)));

/** 16.5 – 38.4: the system on the pharmacy's WhatsApp. */
const Solution: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  if (t < 16.5 || t > 38.5) return null;
  const s4 = T.s4;
  const s5 = T.s5;
  const s6 = T.s6;
  const phoneK = sp(frame, s4.phone, {damping: 15, stiffness: 150, mass: 0.9});
  const toCenter = prog(t, s5.cal - 0.2, s5.cal + 0.5, easeInOut);
  const phoneOut = leave(t, 35.5, 0.45);
  const px = lerp(220, 320, toCenter);
  const second = t >= s5.cal;
  const scroll = second ? 0 : 0;
  // Attendant: in at s4.atendente, out at s5.cal, back for the win.
  let aw = walk(t, s4.atendente, 0.6, 1260, 860);
  if (t > s5.cal) aw = walk(t, s5.cal, 0.5, 860, 1260, 2);
  if (t > s6.win) aw = walk(t, s6.win, 0.55, 1260, 840, 2);
  const aOut = leave(t, s6.exit, 0.3);
  let mw = walk(t, s5.maria - 0.3, 0.6, -200, 170);
  if (t > s6.chip1 - 0.4) mw = walk(t, s6.chip1 - 0.4, 0.5, 170, 250, 1);
  const win = t > s6.win;
  const jump = win && t < s6.win + 1.2 ? Math.abs(Math.sin((t - s6.win) * Math.PI * 2.5)) * 60 : 0;
  const mOut = leave(t, s6.exit, 0.3);
  const cal = pop(frame, s5.cal);
  const calOut = leave(t, s5.calOut, 0.35);
  const calN = Math.max(1, Math.round(prog(t, s5.cal + 0.15, s5.calOut - 0.15, easeOut) * 30));
  const quero = sp(frame, s5.quero, {damping: 8, stiffness: 200});
  return (
    <>
      {t > s4.atendente && aOut < 1 && <Atendente frame={frame} w={{...aw, lift: aw.lift + (win ? jump * 0.8 : 0), x: aw.x + aOut * 500}} />}
      {phoneOut < 1 && (
        <div style={{position: 'absolute', left: px, top: 430 + (1 - phoneK) * 1000 + phoneOut * 1000, transform: `rotate(${(1 - phoneK) * -10 + (second ? 0 : -2)}deg)`}}>
          <Phone w={460} h={770} scroll={scroll}>
            {!second ? (
              <>
                <Bubble k={pop(frame, s4.orcamento)} side="out">
                  Orçamento pronto
                  <br />
                  <b>R$ 189,90</b> · dura 30 dias
                </Bubble>
                <Bubble k={pop(frame, s4.fechado)} side="in">
                  Fechado!
                </Bubble>
                <Bubble k={pop(frame, s4.type)} side="out" bg={C.gold}>
                  <span style={{fontFamily: F.label}}>{typed('#fechou30', t, s4.type + 0.15) || ' '}</span>
                  <span style={{opacity: Math.floor(t * 4.8) % 2 && t < s4.lembrete ? 1 : 0}}>|</span>
                </Bubble>
                <div style={{alignSelf: 'center', transform: `scale(${pop(frame, s4.lembrete)})`, background: C.white, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '8px 16px', fontFamily: F.ui, fontWeight: 700, fontSize: 21, color: C.teal}}>
                  ✓ Lembrete agendado: 30 dias
                </div>
              </>
            ) : (
              <>
                <div style={{alignSelf: 'center', background: '#D9E7F2', border: `3px solid ${C.ink}`, borderRadius: 999, padding: '6px 16px', fontFamily: F.label, fontSize: 18, color: C.ink, transform: `scale(${pop(frame, s5.calOut)})`}}>
                  30 DIAS DEPOIS
                </div>
                <Bubble k={pop(frame, s5.oi)} side="out" tag="AUTOMÁTICO">
                  Oi, Maria!
                  {t > s5.msg && (
                    <>
                      <br />
                      {typed('Sua fórmula está acabando.', t, s5.msg).padEnd(1, ' ')}
                    </>
                  )}
                </Bubble>
                <Bubble k={pop(frame, s5.ask)} side="out">
                  {typed('Quer que a gente já prepare a próxima?', t, s5.ask)}
                </Bubble>
                <div style={{alignSelf: 'flex-start', transform: `scale(${0.3 + 0.7 * quero}) rotate(${(1 - quero) * -12}deg)`, transformOrigin: '0% 100%', opacity: clamp01(quero * 3), background: C.white, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '10px 26px', fontFamily: F.label, fontSize: 46, color: C.ink, boxShadow: `0 6px 0 ${C.ink}`}}>
                  Quero!
                </div>
              </>
            )}
          </Phone>
        </div>
      )}
      {t > s5.maria - 0.3 && mOut < 1 && <Maria frame={frame} w={{...mw, lift: mw.lift + jump, x: mw.x - mOut * 500}} mood={t > s5.quero ? 'happy' : 'ok'} />}
      {cal > 0 && calOut < 1 && (
        <div style={{position: 'absolute', left: 390, top: 600 - calOut * 700, transform: `scale(${cal * 1.5}) rotate(${-4 + calOut * 25}deg)`}}>
          <Calendar n={calN} w={200} />
        </div>
      )}
      <Coins frame={frame} at={s6.win} x={540} y={760} n={20} />
      {t > s6.chip1 - 0.1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, transform: `translateY(${leave(t, s6.exit, 0.3) * -900}px)`}}>
          <Check k={pop(frame, s6.chip1)} text="SEM ANÚNCIO" size={44} />
          <Check k={pop(frame, s6.chip2)} text="SEM DEPENDER DE NINGUÉM" size={38} />
        </div>
      )}
    </>
  );
};

const count = (t: number, a: number, b: number, to: number) => Math.round(prog(t, a, b, easeOut) * to);

/** 48.5 – 69.6: the system, the report, the offer, the call. */
const Offer: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  if (t < 48.4) return null;
  const s7 = T.s7;
  const s8 = T.s8;
  const s9 = T.s9;
  const s10 = T.s10;
  const robot = drop(frame, s7.robot);
  const toSide = prog(t, s8.report - 0.1, s8.report + 0.5, easeInOut);
  const robotOut = leave(t, s9.pin, 0.4);
  const rx = lerp(540, 900, toSide) + robotOut * 600;
  const rs = lerp(1, 0.72, toSide);
  const aw = walk(t, 51.9, 0.6, 1260, 880);
  const aOut = leave(t, s8.report - 0.1, 0.35);
  const phK = pop(frame, s7.chip1 - 0.2);
  const repK = sp(frame, s8.report, {damping: 14, stiffness: 160});
  const repOut = leave(t, s9.pin, 0.35);
  const clients = count(t, s8.clients, s8.clients + 0.8, 18);
  const money = count(t, s8.money, s8.moneyEnd, 2609);
  const shops = [150, 400, 660, 920];
  const shopOut = leave(t, s10.cta - 0.1, 0.35);
  const pin = drop(frame, s9.brasilia);
  const stamp = sp(frame, s9.recompra, {damping: 8, stiffness: 200});
  const stampOut = leave(t, s10.cta, 0.3);
  const cast = [
    {x: 190, at: s10.cta},
    {x: 420, at: s10.cta + 0.12},
    {x: 660, at: s10.cta + 0.24},
    {x: 890, at: s10.cta + 0.36},
  ];
  const handle = pop(frame, s10.handle);
  const chip = pop(frame, s10.chip);
  return (
    <>
      {robot.on && robotOut < 1 && (
        <Prop x={rx} w={230} h={345} lift={robot.lift} squash={robot.squash} scale={rs} ry={-16}>
          <Robot frame={frame} s={230} />
        </Prop>
      )}
      {t > 51.8 && aOut < 1 && <Atendente frame={frame} w={{...aw, x: aw.x + aOut * 500}} />}
      {phK > 0 && t < s8.report + 0.3 && (
        <div style={{position: 'absolute', left: 90, top: 780, transform: `scale(${phK * 0.42 * (1 - leave(t, s8.report - 0.1, 0.3))}) rotate(-6deg)`, transformOrigin: '0 0'}}>
          <Phone w={440} h={720}>
            <Bubble k={1} side="out" tag="AUTOMÁTICO">
              Oi, Maria! Sua fórmula está acabando.
            </Bubble>
          </Phone>
        </div>
      )}
      {t < s8.report + 0.3 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, transform: `translateY(${leave(t, s8.report - 0.1, 0.3) * -800}px)`}}>
          <Check k={pop(frame, s7.chip1)} text="MESMO WHATSAPP" size={42} />
          <Check k={pop(frame, s7.chip2)} text="ROTINA IGUAL" size={42} />
        </div>
      )}
      {repK > 0 && repOut < 1 && (
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 470,
            width: 640,
            background: C.white,
            border: `5px solid ${C.ink}`,
            borderRadius: 26,
            boxShadow: `10px 12px 0 ${C.ink}`,
            overflow: 'hidden',
            transform: `translateY(${(1 - repK) * 900 + repOut * 1000}px) rotate(${-1.5 + (1 - repK) * 8}deg)`,
          }}
        >
          <div style={{background: C.teal, color: C.white, fontFamily: F.label, fontSize: 38, textAlign: 'center', padding: '22px 0'}}>RELATÓRIO DO MÊS</div>
          <div style={{position: 'relative', height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 34, borderBottom: `4px solid ${C.ink}`, margin: '0 50px'}}>
            {[0.28, 0.42, 0.62, 1].map((v, i) => {
              const k = sp(frame, s8.bars + i * 0.15, {damping: 12, stiffness: 160});
              return <div key={i} style={{width: 78, height: 200 * v * k, background: i === 3 ? C.green : '#9EE2B6', border: `4px solid ${C.ink}`, borderBottom: 'none', borderRadius: '10px 10px 0 0'}} />;
            })}
            <div style={{position: 'absolute', right: -30, top: 14, fontFamily: F.ui, fontSize: 18, fontWeight: 700, color: '#777', border: '2px solid #999', borderRadius: 99, padding: '2px 10px'}}>exemplo</div>
          </div>
          {[
            ['Clientes que voltaram', t > s8.clients ? String(clients) : '—'],
            ['Em recompras', t > s8.money ? `R$ ${money.toLocaleString('pt-BR')}` : '—'],
          ].map(([a, b]) => (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '22px 40px', fontFamily: F.ui, fontWeight: 600, fontSize: 30, color: C.ink, borderBottom: '2px solid #E6E0D6'}}>
              {a}
              <span style={{fontFamily: F.label, fontSize: 44, color: C.teal}}>{b}</span>
            </div>
          ))}
        </div>
      )}
      {t > s9.city - 0.05 &&
        shopOut < 1 &&
        shops.map((x, i) => {
          const k = sp(frame, s9.city + i * 0.12, {damping: 12, stiffness: 190});
          return (
            <Prop key={i} x={x} w={190} h={162} ry={-20 + i * 4} scale={Math.max(0.001, k * (1 - shopOut))} lift={(1 - k) * 160}>
              <Shop w={190} name="FARMÁCIA" color={[C.teal, C.blue, C.coral, C.teal][i]} />
            </Prop>
          );
        })}
      {pin.on && shopOut < 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 470 - pin.lift, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${1 - shopOut})`}}>
          <svg width={120} height={150} viewBox="0 0 120 150">
            <path d="M60 146 C60 146 10 86 10 56 A50 50 0 0 1 110 56 C110 86 60 146 60 146 Z" fill={C.red} stroke={C.ink} strokeWidth={6} />
            <circle cx={60} cy={56} r={20} fill={C.white} stroke={C.ink} strokeWidth={5} />
          </svg>
          <div style={{marginTop: 14, background: C.paper, border: `4px solid ${C.ink}`, borderRadius: 12, padding: '10px 26px', fontFamily: F.label, fontSize: 36, color: C.ink, boxShadow: `0 6px 0 ${C.ink}`}}>FARMÁCIAS DE BRASÍLIA</div>
        </div>
      )}
      {stamp > 0 && stampOut < 1 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center', transform: `translateY(${stampOut * -900}px)`}}>
          <div style={{transform: `scale(${2.2 - 1.2 * stamp}) rotate(-6deg)`, opacity: clamp01(stamp * 4), background: C.green, color: C.white, fontFamily: F.label, fontSize: 92, padding: '14px 46px', border: `6px solid ${C.ink}`, borderRadius: 14, boxShadow: `0 12px 0 ${C.ink}`, textShadow: `0 4px 0 ${C.teal}`}}>
            RECOMPRA
          </div>
        </div>
      )}
      {t > s10.cta &&
        cast.map((c, i) => {
          const d = drop(frame, c.at);
          const bob = Math.abs(Math.sin((t - c.at) * 2.2 + i)) * 10;
          const w = {x: c.x, lift: d.lift + bob, squash: d.squash};
          if (i === 0) return <Maria key={i} frame={frame} w={w} mood="happy" scale={0.8} />;
          if (i === 1) return <Atendente key={i} frame={frame} w={w} scale={0.82} />;
          if (i === 2)
            return (
              <Prop key={i} x={c.x} w={230} h={345} lift={w.lift} squash={w.squash} scale={0.6} ry={-16}>
                <Robot frame={frame} s={230} />
              </Prop>
            );
          return (
            <Prop key={i} x={c.x} w={150} h={210} lift={w.lift} squash={w.squash} ry={-24}>
              <Jar s={150} fill={1} />
            </Prop>
          );
        })}
      {handle > 0 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
          <div style={{transform: `scale(${0.4 + 0.6 * handle}) rotate(${-2 + (1 - handle) * 10}deg)`, opacity: clamp01(handle * 3), background: C.white, border: `6px solid ${C.ink}`, borderRadius: 999, padding: '20px 60px', fontFamily: F.label, fontSize: 76, color: C.ink, boxShadow: `0 12px 0 ${C.ink}`}}>
            @bielrios.s
          </div>
          <div style={{transform: `scale(${0.4 + 0.6 * chip})`, opacity: clamp01(chip * 3), background: C.green, border: `5px solid ${C.ink}`, borderRadius: 999, padding: '14px 40px', fontFamily: F.label, fontSize: 40, color: C.white, boxShadow: `0 8px 0 ${C.ink}`}}>
            DIRECT OU WHATSAPP
          </div>
        </div>
      )}
    </>
  );
};

export const Recompra: React.FC = () => {
  useFarmaciaFonts();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.sky, overflow: 'hidden'}}>
      <City frame={frame} />
      <Counter />
      <AbsoluteFill style={{perspective: 1800, perspectiveOrigin: '50% 38%'}}>
        <Problem frame={frame} />
        <Solution frame={frame} />
        <Offer frame={frame} />
      </AbsoluteFill>
      <Talk frame={frame} />
      <TapeLabel frame={frame} />
      <WordTiles frame={frame} />
      <Vignette />
      <Grain frame={frame} opacity={0.07} />
    </AbsoluteFill>
  );
};
