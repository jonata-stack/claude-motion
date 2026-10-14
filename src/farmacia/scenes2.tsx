import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {clamp01, easeIn, easeInOut, easeOut, lerp, prog} from '../lib';
import {cap, FASHION, FF, FOOD, IMG, P, PHARMA, scene} from './lib';
import {
  Bag,
  FASHION_BRAND,
  FashionTile,
  FOOD_BRAND,
  FoodTile,
  Pants,
  PHARMA_BRAND,
  PHARMA_GRID,
  PharmaTile,
  Profile,
  Sneaker,
  Tee,
} from './posts';
import {Segment} from './scenes1';
import {Abs, Bg, Box, BOX_RATIO, Calendar, Chip, DemoTag, Glow, Hand, Headline, Kicker, life, Phone, Photo} from './ui';

type SP = {t: number};

const Card: React.FC<{w: number; h: number; x: number; y: number; rot?: number; k?: number; children: React.ReactNode; radius?: number}> = ({
  w,
  h,
  x,
  y,
  rot = 0,
  k = 1,
  children,
  radius = 22,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: radius,
      overflow: 'hidden',
      boxShadow: `0 30px 60px rgba(0,0,0,0.28)`,
      transform: `rotate(${rot * k}deg) translateY(${(1 - k) * 120}px) scale(${0.92 + 0.08 * k})`,
      opacity: clamp01(k * 1.8),
    }}
  >
    {children}
  </div>
);

/** The three demo profiles side by side, one per segment, rising in from `a`. */
const Trio: React.FC<{t: number; a: number; tileK?: (i: number) => number}> = ({t, a, tileK}) => (
  <>
    {[
      {brand: PHARMA_BRAND, tile: (i: number, w: number) => <PharmaTile kind={PHARMA_GRID[i]} w={w} />, label: 'Farmácias', col: PHARMA.green},
      {brand: FOOD_BRAND, tile: (i: number, w: number) => <FoodTile i={i} w={w} label={false} />, label: 'Alimentação', col: FOOD.pink},
      {brand: FASHION_BRAND, tile: (i: number, w: number) => <FashionTile i={i + (i % 2)} w={w} />, label: 'Roupas e calçados', col: FASHION.black},
    ].map((p, i) => {
      const k = prog(t, a + 0.3 + i * 0.2, a + 1.1 + i * 0.2, easeOut);
      return (
        <React.Fragment key={i}>
          <Phone x={200 + i * 340} y={lerp(1100, 900, k)} w={300} opacity={clamp01(k * 2)}>
            <Profile w={279} brand={p.brand} tile={p.tile} rows={4} tileK={tileK} />
          </Phone>
          <Abs x={200 + i * 340} y={lerp(1400, 1250, k)} style={{transform: 'translateX(-50%)', opacity: k, whiteSpace: 'nowrap'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12, fontFamily: FF.sans, fontWeight: 700, fontSize: 30, color: P.ink}}>
              <span style={{width: 14, height: 14, borderRadius: '50%', background: p.col}} />
              {p.label}
            </div>
          </Abs>
        </React.Fragment>
      );
    })}
  </>
);

/* ---------------------------------------------------------------- S5 */

export const S5: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s5', i);
  const s = scene('s5');
  const a1 = s.start;
  const a2 = c(6) - 0.35;
  const a3 = c(8) - 0.35;
  const a4 = c(10) - 0.35;
  const rules = prog(t, c(2) - 0.1, c(2) + 0.7, easeOut);
  const swap = prog(t, c(4) - 0.1, c(4) + 0.7, easeInOut);
  return (
    <AbsoluteFill>
      <Segment t={t} a={a1} b={a2 + 0.4}>
        <Bg color={PHARMA.bg} />
        <Abs x={90} y={250}>
          <Kicker color={PHARMA.green}>Para</Kicker>
          <Headline t={t} at={a1 + 0.5} lines={['Farmácias', 'e drogarias']} size={96} color={PHARMA.ink} />
        </Abs>
        <Card w={430} h={430} x={70} y={640} rot={-6} k={prog(t, a1 + 0.6, a1 + 1.4, easeOut)}>
          <PharmaTile kind="team" w={430} />
        </Card>
        <Card w={430} h={430} x={580} y={610} rot={5} k={prog(t, a1 + 0.9, a1 + 1.7, easeOut)}>
          <PharmaTile kind="vitafor" w={430} />
        </Card>
        <Card w={540} h={540} x={270} y={760} rot={-1} k={prog(t, c(1) - 0.2, c(1) + 0.6, easeOut)}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - swap}}>
            <PharmaTile kind="catarinense" w={540} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: swap, transform: `scale(${1.06 - 0.06 * swap})`}}>
            <PharmaTile kind="calcium" w={540} />
          </div>
        </Card>
        <Abs x={540} y={lerp(1250, 1210, rules)} style={{transform: 'translateX(-50%)', opacity: clamp01(rules * 1.6)}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              width: 820,
              padding: '22px 30px',
              borderRadius: 26,
              background: P.white,
              boxShadow: `0 20px 50px ${P.shadow}`,
              fontFamily: FF.sans,
              fontWeight: 650,
              fontSize: 31,
              lineHeight: 1.22,
              color: PHARMA.ink,
            }}
          >
            <svg width={64} height={64} viewBox="0 0 24 24" style={{flexShrink: 0}}>
              <path d="M12 2 L20 5.5 V11.5 C20 16.5 16.6 20.4 12 22 C7.4 20.4 4 16.5 4 11.5 V5.5 Z" fill={PHARMA.green} />
              <path d="M8 12 L11 15 L16.5 9" fill="none" stroke={PHARMA.bg} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(t, c(3) - 0.2, c(3) + 0.5, easeOut)} />
            </svg>
            Conteúdo alinhado às normas de publicidade e às exigências da Anvisa
          </div>
        </Abs>
        <Abs x={90} y={1352} style={{opacity: prog(t, a1 + 1.4, a1 + 2, easeOut)}}>
          <DemoTag />
        </Abs>
      </Segment>

      <Segment t={t} a={a2} b={a3 + 0.4}>
        <Bg color={FOOD.bg} />
        <Glow x={700} y={900} r={700} color="232,41,111" o={0.22} />
        <Abs x={90} y={250}>
          <Kicker color={FOOD.gold}>Para</Kicker>
          <div style={{fontFamily: FF.anton, fontSize: 132, color: FOOD.cream, lineHeight: 1.05, opacity: prog(t, a2 + 0.4, a2 + 1, easeOut)}}>ALIMENTAÇÃO</div>
        </Abs>
        <Card w={430} h={760} x={90} y={560} rot={-3} k={prog(t, a2 + 0.5, a2 + 1.3, easeOut)} radius={30}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${1.05 + 0.12 * prog(t, a2, a3, (x) => x)})`}}>
            <Photo src={IMG.acaiBanana} w={430} h={760} pos="50% 50%" zoom={1.05} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, background: 'linear-gradient(180deg, rgba(43,10,27,0), rgba(43,10,27,0.95))'}} />
          <div style={{position: 'absolute', left: 30, bottom: 34, fontFamily: FF.anton, fontSize: 56, lineHeight: 1, color: FOOD.cream}}>
            DO PREPARO
            <br />
            AO COPO
          </div>
          <div style={{position: 'absolute', right: 26, top: 26, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,243,230,0.85)', display: 'grid', placeItems: 'center'}}>
            <svg width={26} height={26} viewBox="0 0 24 24">
              <path d="M7 4 L20 12 L7 20 Z" fill={FOOD.bg} />
            </svg>
          </div>
        </Card>
        <Card w={400} h={400} x={590} y={540} rot={4} k={prog(t, a2 + 0.8, a2 + 1.6, easeOut)}>
          <FoodTile i={1} w={400} />
        </Card>
        <Card w={400} h={400} x={580} y={960} rot={-3} k={prog(t, c(7) - 0.2, c(7) + 0.6, easeOut)}>
          <FoodTile i={2} w={400} />
        </Card>
        <Abs x={90} y={1352} style={{opacity: prog(t, a2 + 1.2, a2 + 1.8, easeOut)}}>
          <DemoTag dark />
        </Abs>
      </Segment>

      <Segment t={t} a={a3} b={a4 + 0.4}>
        <Bg color={FASHION.bg} />
        <Abs x={90} y={250}>
          <Kicker color={FASHION.camel}>Para</Kicker>
          <div style={{fontFamily: FF.serif, fontSize: 124, color: FASHION.black, lineHeight: 0.95, opacity: prog(t, a3 + 0.4, a3 + 1, easeOut)}}>
            Roupas e<br />
            calçados
          </div>
        </Abs>
        {(() => {
          const k = (d: number) => prog(t, a3 + 0.5 + d, a3 + 1.2 + d, easeOut);
          return (
            <Abs x={80} y={600} w={920} h={720}>
              <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: FASHION.stone}} />
              <div style={{position: 'absolute', left: 60, top: 40, opacity: k(0), transform: `translateY(${(1 - k(0)) * 40}px) rotate(-6deg)`}}>
                <Tee color={FASHION.camel} s={380} />
              </div>
              <div style={{position: 'absolute', left: 470, top: 50, opacity: k(0.2), transform: `translateY(${(1 - k(0.2)) * 40}px) rotate(4deg)`}}>
                <Pants color={FASHION.black} s={420} />
              </div>
              <div style={{position: 'absolute', left: 90, top: 470, opacity: k(0.4), transform: `translateY(${(1 - k(0.4)) * 40}px) rotate(-3deg)`}}>
                <Sneaker color={FASHION.bg} sole={FASHION.black} s={360} />
              </div>
              <div style={{position: 'absolute', left: 700, top: 420, opacity: k(0.6), transform: `translateY(${(1 - k(0.6)) * 40}px) rotate(8deg)`}}>
                <Bag color={FASHION.olive} s={200} />
              </div>
              {(() => {
                const kk = prog(t, c(9) - 0.1, c(9) + 0.5, easeOut);
                return (
                  <div style={{position: 'absolute', right: 30, top: 30, opacity: kk, transform: `scale(${0.9 + 0.1 * kk})`}}>
                    <Chip label="Combinação" k={kk} dot={FASHION.camel} size={28} />
                  </div>
                );
              })()}
            </Abs>
          );
        })()}
        <Card w={330} h={330} x={660} y={1000} rot={5} k={prog(t, c(9) + 0.3, c(9) + 1.1, easeOut)}>
          <FashionTile i={0} w={330} />
        </Card>
        <Abs x={90} y={1352} style={{opacity: prog(t, a3 + 1.2, a3 + 1.8, easeOut)}}>
          <DemoTag />
        </Abs>
      </Segment>

      <Segment t={t} a={a4} b={s.end + 1}>
        <Bg color={P.cream} />
        <Trio t={t} a={a4} />
        <Abs x={90} y={250} w={900}>
          <Headline t={t} at={c(10)} lines={['Cada negócio com', 'sua identidade.']} size={84} accent={['identidade']} />
        </Abs>
        <Abs x={540} y={1330} style={{transform: 'translateX(-50%)', opacity: prog(t, a4 + 1, a4 + 1.6, easeOut)}}>
          <DemoTag size={19} />
        </Abs>
      </Segment>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- price card */

const Row: React.FC<{k: number; children: React.ReactNode; size?: number; color?: string; weight?: number; icon?: boolean}> = ({
  k,
  children,
  size = 42,
  color = P.ink,
  weight = 550,
  icon = true,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      fontFamily: FF.sans,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
      padding: '9px 0',
      opacity: 0.22 + 0.78 * clamp01(k * 1.6),
      transform: `translateX(${(1 - k) * 12}px)`,
    }}
  >
    {icon && (
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" style={{flexShrink: 0}}>
        <circle cx={12} cy={12} r={11} fill={P.accentSoft} />
        <path d="M7 12.5 L10.5 16 L17 8.5" fill="none" stroke={P.accent} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    <span>{children}</span>
  </div>
);

const PriceCard: React.FC<{
  x: number;
  y: number;
  w: number;
  k: number;
  label: string;
  name: string;
  price: string;
  per?: string;
  children: React.ReactNode;
}> = ({x, y, w, k, label, name, price, per = '/mês', children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      padding: '46px 54px 44px',
      boxSizing: 'border-box',
      borderRadius: 40,
      background: P.cream,
      color: P.ink,
      boxShadow: '0 40px 90px rgba(0,0,0,0.4)',
      opacity: clamp01(k * 1.5),
      transform: `translateY(${(1 - k) * 90}px) scale(${0.96 + 0.04 * k})`,
    }}
  >
    <div style={{fontFamily: FF.mono, fontSize: 24, fontWeight: 600, letterSpacing: '0.22em', color: P.accent}}>{label}</div>
    <div style={{fontFamily: FF.sans, fontSize: 64, fontWeight: 820, letterSpacing: '-0.035em', marginTop: 8}}>{name}</div>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6}}>
      <span style={{fontFamily: FF.sans, fontSize: 132, fontWeight: 820, letterSpacing: '-0.05em', lineHeight: 1}}>{price}</span>
      <span style={{fontFamily: FF.sans, fontSize: 50, fontWeight: 600, opacity: 0.6}}>{per}</span>
    </div>
    <div style={{height: 2, background: P.inkFaint, margin: '28px 0 16px'}} />
    {children}
  </div>
);

const Note: React.FC<{k: number; children: React.ReactNode; dark?: boolean}> = ({k, children, dark}) => (
  <div
    style={{
      marginTop: 18,
      padding: '16px 22px',
      borderRadius: 16,
      background: dark ? 'rgba(244,239,231,0.08)' : P.sand,
      fontFamily: FF.sans,
      fontSize: 30,
      fontWeight: 500,
      lineHeight: 1.3,
      color: dark ? P.muted : P.inkSoft,
      opacity: 0.22 + 0.78 * clamp01(k * 1.6),
    }}
  >
    {children}
  </div>
);

/** A carousel of 4 pages, fanned, with page dots. */
const Carousel: React.FC<{x: number; y: number; s: number; k: number}> = ({x, y, s, k}) => (
  <Abs x={x} y={y}>
    {[0, 1, 2, 3].map((kind, i) => {
      const kk = clamp01(k * 2 - i * 0.25);
      return (
        <div
          key={kind}
          style={{
            position: 'absolute',
            left: i * s * 0.2 * kk,
            top: 0,
            width: s,
            height: s,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 16px 30px rgba(0,0,0,0.35)',
            zIndex: 4 - i,
            opacity: clamp01(kk * 2),
          }}
        >
          <FoodTile i={kind} w={s} />
        </div>
      );
    })}
    <div style={{position: 'absolute', left: 0, top: s + 22, display: 'flex', gap: 10, opacity: k}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{width: i === 0 ? 30 : 12, height: 12, borderRadius: 9, background: i === 0 ? P.accent : P.faint}} />
      ))}
    </div>
  </Abs>
);

export const S6: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s6', i);
  const s = scene('s6');
  const ex = prog(t, s.start + 0.3, s.start + 1.2, easeOut);
  const card = prog(t, c(1) - 0.2, c(1) + 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Bg color={P.graphite}>
        <Glow x={540} y={900} r={800} color="208,112,62" o={0.1} />
      </Bg>
      <Carousel x={110} y={lerp(280, 220, ex)} s={230} k={ex} />
      <Abs x={110} y={lerp(280, 220, ex) + 276} style={{fontFamily: FF.mono, fontSize: 22, letterSpacing: '0.16em', color: P.muted, opacity: ex, marginLeft: 120}}>
        CARROSSEL
      </Abs>
      <Abs x={720} y={lerp(280, 220, ex)} style={{opacity: clamp01(ex * 2 - 0.4)}}>
        <div style={{width: 230, height: 230, borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 30px rgba(0,0,0,0.35)', position: 'relative'}}>
          <FashionTile i={1} w={230} />
        </div>
        <div style={{fontFamily: FF.mono, fontSize: 22, letterSpacing: '0.16em', color: P.muted, marginTop: 34}}>POST ÚNICO</div>
      </Abs>
      <Abs x={540} y={168} style={{transform: 'translateX(-50%)', opacity: ex}}>
        <DemoTag dark size={18} />
      </Abs>
      <PriceCard x={70} y={540} w={940} k={card} label="PLANO" name="ESSENCIAL" price="R$ 500">
        <Row k={prog(t, c(2) - 0.1, c(2) + 0.5, easeOut)} size={46} weight={760} icon={false} color={P.accent}>
          8 publicações no feed
        </Row>
        <Row k={prog(t, c(4) - 0.1, c(4) + 0.5, easeOut)}>4 carrosséis de até 4 páginas</Row>
        <Row k={prog(t, c(4) + 0.9, c(4) + 1.5, easeOut)}>4 posts de imagem única</Row>
        <Row k={prog(t, c(3), c(3) + 0.6, easeOut)}>Artes + legendas + calendário + publicação</Row>
        <Note k={prog(t, c(4) + 1.8, c(4) + 2.4, easeOut)}>Produção remota com fotos fornecidas pelo cliente.</Note>
      </PriceCard>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S7 */

/** Phone camera viewfinder filming a product on the counter; a hand sets the product. */
const Viewfinder: React.FC<{t: number; a: number; w: number}> = ({t, a, w}) => {
  const h = w * 2.06 - w * 0.07;
  const sw = w * 0.93;
  const place = prog(t, a + 0.2, a + 1.2, easeOut);
  const zoom = 1 + 0.25 * prog(t, a + 1.6, a + 3.2, easeInOut);
  const sec = Math.max(0, Math.floor(t - a));
  return (
    <div style={{position: 'absolute', inset: 0, background: P.sand2, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 60%'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.62, bottom: 0, background: P.sand3}} />
        <Glow x={sw * 0.5} y={h * 0.45} r={sw * 0.8} o={0.6} />
        <div style={{position: 'absolute', left: sw * 0.1, top: h * 0.62 - sw * 0.4 + (1 - place) * -h * 0.3, opacity: clamp01(place * 3), filter: `drop-shadow(0 ${sw * 0.03}px ${sw * 0.03}px ${P.shadow})`}}>
          <Sneaker color={FASHION.camel} sole={FASHION.bg} s={sw * 0.8} />
        </div>
        <Hand x={sw * 0.82} y={lerp(h * 0.3, -h * 0.25, prog(t, a + 1.1, a + 1.8, easeIn))} rot={200} s={0.9} curl={0.6} skin={P.skinB} skinDark={P.skinBDark} sleeve={P.sleeveB} />
      </div>
      {[1, 2].map((i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: (sw * i) / 3, top: 0, bottom: 0, width: 1.5, background: 'rgba(255,255,255,0.5)'}} />
          <div style={{position: 'absolute', top: (h * i) / 3, left: 0, right: 0, height: 1.5, background: 'rgba(255,255,255,0.5)'}} />
        </React.Fragment>
      ))}
      <div style={{position: 'absolute', left: '50%', top: w * 0.16, transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 99, background: 'rgba(28,29,31,0.6)', fontFamily: FF.mono, fontSize: w * 0.05, color: P.white}}>
        <span style={{width: w * 0.035, height: w * 0.035, borderRadius: '50%', background: P.rec, opacity: Math.floor(t * 2) % 2 ? 1 : 0.35}} />
        00:{String(sec).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: '50%', bottom: w * 0.1, width: w * 0.2, height: w * 0.2, marginLeft: -w * 0.1, borderRadius: '50%', border: `${w * 0.012}px solid ${P.white}`, display: 'grid', placeItems: 'center'}}>
        <div style={{width: w * 0.09, height: w * 0.09, borderRadius: w * 0.02, background: P.rec}} />
      </div>
    </div>
  );
};

const Storefront: React.FC<{t: number; a: number}> = ({t, a}) => {
  const door = prog(t, a + 0.8, a + 1.8, easeInOut);
  return (
    <svg width={900} height={760} viewBox="0 0 900 760">
      <rect x={0} y={60} width={900} height={700} rx={18} fill={P.sand} />
      <rect x={0} y={60} width={900} height={110} rx={18} fill={P.graphite2} />
      {Array.from({length: 9}, (_, i) => (
        <path key={i} d={`M${i * 100} 170 h100 v40 q-50 34 -100 0 z`} fill={i % 2 ? P.cream : PHARMA.green} />
      ))}
      <rect x={60} y={270} width={430} height={400} rx={10} fill="#DCE7E2" />
      <rect x={60} y={460} width={430} height={10} fill={P.sand3} />
      <rect x={560} y={270} width={280} height={490} rx={8} fill={P.graphite3} />
      <rect x={560} y={270} width={280 * (1 - 0.7 * door)} height={490} rx={8} fill="#CFDDD7" stroke={P.graphite3} strokeWidth={8} />
      <rect x={800 - 240 * door} y={500} width={14} height={60} rx={6} fill={P.graphite} opacity={1 - door} />
      <rect x={600} y={320} width={150} height={56} rx={10} fill={P.white} />
      <text x={675} y={358} textAnchor="middle" fontFamily="Inter Variable, Inter" fontWeight={750} fontSize={30} fill={PHARMA.green}>
        ABERTO
      </text>
    </svg>
  );
};

export const S7: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s7', i);
  const s = scene('s7');
  const vfA = s.start;
  const shopA = c(3) - 0.3;
  const editA = c(5) - 0.3;
  const cardA = c(6) - 0.3;
  const vf = life(t, vfA, shopA + 0.4, 0.6, 0.4);
  const shop = life(t, shopA, editA + 0.4, 0.6, 0.4);
  const edit = life(t, editA, cardA + 0.4, 0.5, 0.4);
  const card = prog(t, cardA, cardA + 0.8, easeOut);
  const head = prog(t, c(1) - 0.1, c(1) + 0.6, easeOut) * (1 - prog(t, cardA - 0.3, cardA + 0.1, easeIn));
  return (
    <AbsoluteFill>
      <Bg color={P.graphite}>
        <Glow x={540} y={900} r={800} color="208,112,62" o={0.1} />
      </Bg>
      <Abs x={90} y={250} style={{opacity: head}}>
        <div style={{fontFamily: FF.mono, fontSize: 26, fontWeight: 600, letterSpacing: '0.2em', color: P.accent}}>PLANO</div>
        <div style={{fontFamily: FF.sans, fontWeight: 820, fontSize: 64, letterSpacing: '-0.035em', color: P.cream, marginTop: 6}}>PRESENÇA + VÍDEO</div>
        <div
          style={{
            fontFamily: FF.sans,
            fontWeight: 820,
            fontSize: 64,
            letterSpacing: '-0.035em',
            color: P.cream,
            opacity: prog(t, c(2) - 0.1, c(2) + 0.5, easeOut),
          }}
        >
          R$ 1.200<span style={{fontSize: 40, opacity: 0.6}}>/mês</span>
        </div>
      </Abs>
      {vf > 0 && (
        <AbsoluteFill style={{opacity: vf}}>
          <Phone x={540} y={lerp(1000, 920, vf)} w={400} screen={P.sand2}>
            <Viewfinder t={t} a={vfA + 0.3} w={400} />
          </Phone>
          <svg width={600} height={600} viewBox="0 0 600 600" style={{position: 'absolute', left: 240, top: lerp(1000, 920, vf) + 400}}>
            <rect x={270} y={0} width={60} height={70} rx={10} fill={P.graphite3} />
            <path d="M300 60 L120 600 M300 60 L480 600 M300 60 L300 600" stroke={P.graphite3} strokeWidth={16} strokeLinecap="round" />
          </svg>
        </AbsoluteFill>
      )}
      {shop > 0 && (
        <AbsoluteFill style={{opacity: shop}}>
          <Abs x={90} y={lerp(640, 600, shop)}>
            <Storefront t={t} a={shopA} />
          </Abs>
          <Abs x={140} y={880}>
            <div style={{display: 'flex', gap: 14, alignItems: 'flex-end'}}>
              {(['k2', 'artro', 'd3'] as const).map((k) => (
                <Box key={k} src={IMG[k]} w={k === 'd3' ? 96 : 120} ratio={BOX_RATIO[k]} />
              ))}
            </div>
          </Abs>
          <Abs x={540} y={1300} style={{transform: 'translateX(-50%)'}}>
            <Chip label="1 visita mensal de até 2 horas" k={prog(t, c(3) + 0.6, c(3) + 1.2, easeOut)} size={34} />
          </Abs>
        </AbsoluteFill>
      )}
      {edit > 0 && (
        <AbsoluteFill style={{opacity: edit}}>
          {[0, 1, 2, 3].map((i) => {
            const k = prog(t, editA + 0.2 + i * 0.18, editA + 0.9 + i * 0.18, easeOut);
            const x = 112 + i * 222;
            const thumbs = [
              <FoodTile key={0} i={1} w={338} label={false} />,
              <FashionTile key={1} i={2} w={338} />,
              <Photo key={2} src={IMG.vitafor} w={190} h={338} pos="30% 50%" zoom={1} />,
              <FoodTile key={3} i={3} w={338} label={false} />,
            ];
            return (
              <Abs key={i} x={x} y={lerp(800, 660, k)} style={{opacity: k}}>
                <div style={{width: 190, height: 338, borderRadius: 20, overflow: 'hidden', position: 'relative', background: P.sand2, boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>
                  <div style={{position: 'absolute', left: (190 - 338) / 2, top: 0, width: 338, height: 338, transform: `scale(${1 + 0.08 * prog(t, editA, cardA, (x) => x)})`}}>
                    {thumbs[i]}
                  </div>
                  <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55))'}} />
                  <div style={{position: 'absolute', left: 14, bottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 20, color: P.white}}>
                    <svg width={18} height={18} viewBox="0 0 24 24">
                      <path d="M6 3 L21 12 L6 21 Z" fill={P.white} />
                    </svg>
                    até 45s
                  </div>
                </div>
              </Abs>
            );
          })}
          <Abs x={540} y={1080} style={{transform: 'translateX(-50%)'}}>
            <Chip label="4 Reels gravados e editados por nós" k={prog(t, editA + 0.9, editA + 1.4, easeOut)} size={34} />
          </Abs>
        </AbsoluteFill>
      )}
      {card > 0 && (
        <PriceCard x={70} y={270} w={940} k={card} label="PLANO" name="PRESENÇA + VÍDEO" price="R$ 1.200">
          <Row k={prog(t, cardA + 0.5, cardA + 1.0, easeOut)}>1 visita mensal de até 2 horas</Row>
          <Row k={prog(t, cardA + 0.8, cardA + 1.3, easeOut)}>4 Reels de até 45 segundos</Row>
          <Row k={prog(t, c(6) + 1.6, c(6) + 2.1, easeOut)}>8 posts de artes</Row>
          <Row k={prog(t, c(7), c(7) + 0.5, easeOut)}>8 telas de stories adaptadas</Row>
          <Row k={prog(t, c(7) + 1.2, c(7) + 1.8, easeOut)} icon={false} color={P.accent} weight={720} size={40}>
            Planejamento, gravação, edição e publicação.
          </Row>
          <Note k={prog(t, c(7) + 2.2, c(7) + 2.8, easeOut)}>Deslocamento orçado à parte conforme o endereço.</Note>
        </PriceCard>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S8 */

const StepIcon: React.FC<{i: number; s: number; color: string}> = ({i, s, color}) => {
  const st = {fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={s} height={s} viewBox="0 0 24 24">
      {i === 0 && (
        <>
          <circle cx={12} cy={12} r={8} {...st} />
          <circle cx={12} cy={12} r={3.5} {...st} />
        </>
      )}
      {i === 1 && (
        <>
          <rect x={3} y={6} width={13} height={12} rx={3} {...st} />
          <path d="M16 10 L21 7 V17 L16 14" {...st} />
        </>
      )}
      {i === 2 && <path d="M5 12.5 L10 17 L19 7" {...st} />}
      {i === 3 && <path d="M12 19 V6 M6.5 11 L12 5.5 L17.5 11" {...st} />}
    </svg>
  );
};

export const S8: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s8', i);
  const steps = [
    {w: 'Alinhamos.', sub: 'Identidade, produtos e prioridades', at: c(0)},
    {w: 'Produzimos.', sub: 'Calendário e materiais do mês', at: c(2) + 0.6},
    {w: 'Você aprova.', sub: 'Nada vai ao ar sem o seu ok', at: c(4)},
    {w: 'Publicamos.', sub: 'No seu perfil, no dia combinado', at: c(4) + 1.5},
  ];
  const calA = c(5) - 0.3;
  const flow = 1 - prog(t, calA, calA + 0.45, easeIn);
  const cal = prog(t, calA + 0.1, calA + 0.9, easeOut);
  return (
    <AbsoluteFill>
      <Bg color={P.cream} />
      {flow > 0 && (
        <AbsoluteFill style={{opacity: flow}}>
          <Abs x={90} y={250}>
            <Kicker k={prog(t, scene('s8').start + 0.3, scene('s8').start + 1, easeOut)}>Como funciona</Kicker>
          </Abs>
          <div style={{position: 'absolute', left: 150, top: 420, width: 4, height: 750 * prog(t, c(0), steps[3].at + 0.5, (x) => x), background: P.sand2}} />
          {steps.map((st, i) => {
            const k = prog(t, st.at - 0.1, st.at + 0.6, easeOut);
            const y = 380 + i * 235;
            const intro = prog(t, scene('s8').start + 0.4 + i * 0.12, scene('s8').start + 1 + i * 0.12, easeOut);
            return (
              <Abs key={i} x={90} y={y} style={{display: 'flex', alignItems: 'center', gap: 40, opacity: intro * (0.2 + 0.8 * k)}}>
                <div
                  style={{
                    width: 124,
                    height: 124,
                    borderRadius: '50%',
                    background: i === 2 ? P.accent : P.graphite,
                    display: 'grid',
                    placeItems: 'center',
                    transform: `scale(${0.7 + 0.3 * k})`,
                    boxShadow: `0 16px 30px ${P.shadow}`,
                  }}
                >
                  <StepIcon i={i} s={58} color={P.cream} />
                </div>
                <div style={{transform: `translateX(${(1 - k) * 30}px)`}}>
                  <div style={{fontFamily: FF.sans, fontWeight: 780, fontSize: 72, letterSpacing: '-0.035em', color: P.ink, lineHeight: 1}}>{st.w}</div>
                  <div style={{fontFamily: FF.sans, fontWeight: 500, fontSize: 32, color: P.inkSoft, marginTop: 10}}>{st.sub}</div>
                </div>
              </Abs>
            );
          })}
        </AbsoluteFill>
      )}
      {cal > 0 && (
        <AbsoluteFill style={{opacity: cal}}>
          <Abs x={90} y={250} w={900}>
            <Kicker>Plano presencial</Kicker>
            <div style={{height: 16}} />
            <Headline t={t} at={calA + 0.3} lines={['Uma sessão agendada,', 'os vídeos do mês.']} size={74} accent={['agendada']} />
          </Abs>
          <Abs x={90} y={lerp(640, 590, cal)}>
            <Calendar
              w={900}
              fill={(d) => (d % 7 === 1 || d % 7 === 4 ? prog(t, calA + 0.4 + d * 0.02, calA + 0.6 + d * 0.02, easeOut) : 0)}
              color={(d) => (d % 7 === 4 ? P.sand3 : P.graphite3)}
              mark={{day: 9, k: prog(t, c(6) - 0.2, c(6) + 0.4, easeOut), label: ''}}
            />
          </Abs>
          <Abs x={540} y={1290} style={{transform: 'translateX(-50%)'}}>
            <Chip label="Sessão de gravação • até 2 horas" k={prog(t, c(6) + 0.2, c(6) + 0.8, easeOut)} size={32} dark />
          </Abs>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S9 */

const AddOn: React.FC<{x: number; y: number; k: number; title: string; price: string; detail: string; note?: React.ReactNode}> = ({x, y, k, title, price, detail, note}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: 940,
      padding: '48px 54px',
      boxSizing: 'border-box',
      borderRadius: 34,
      background: P.graphite2,
      border: `2px solid ${P.line}`,
      color: P.cream,
      opacity: clamp01(k * 1.5),
      transform: `translateY(${(1 - k) * 70}px)`,
      fontFamily: FF.sans,
    }}
  >
    <div style={{fontSize: 58, fontWeight: 760, letterSpacing: '-0.03em', lineHeight: 1.08}}>{title}</div>
    <div style={{fontSize: 66, fontWeight: 820, letterSpacing: '-0.03em', color: P.accentHi, marginTop: 18}}>{price}</div>
    <div style={{fontSize: 38, fontWeight: 500, color: P.muted, marginTop: 16, lineHeight: 1.3}}>{detail}</div>
    {note}
  </div>
);

export const S9: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s9', i);
  const s = scene('s9');
  return (
    <AbsoluteFill>
      <Bg color={P.graphite} />
      <Abs x={90} y={250}>
        <Kicker k={prog(t, s.start + 0.3, s.start + 1, easeOut)}>Serviços adicionais</Kicker>
      </Abs>
      <AddOn
        x={70}
        y={330}
        k={prog(t, c(0) - 0.1, c(0) + 0.7, easeOut)}
        title="Organização inicial do perfil"
        price="R$ 250 • pagamento único"
        detail="Bio + até 5 capas de destaques + modelos visuais"
      />
      <AddOn
        x={70}
        y={800}
        k={prog(t, c(1) - 0.1, c(1) + 0.7, easeOut)}
        title="Atendimento básico no Instagram"
        price="+ R$ 400/mês"
        detail="2 checagens por dia útil • até 20 min/dia no total"
        note={<Note k={prog(t, c(2), c(2) + 0.6, easeOut)} dark>Pedidos e dúvidas específicas encaminhados à equipe da loja.</Note>}
      />
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- S10 */

export const S10: React.FC<SP> = ({t}) => {
  const c = (i: number) => cap('s10', i);
  const s = scene('s10');
  const phoneA = c(1) - 0.3;
  const endA = c(2) - 0.4;
  const prod = 1 - prog(t, phoneA, phoneA + 0.5, easeIn);
  const ph = life(t, phoneA, endA + 0.45, 0.7, 0.45);
  const end = prog(t, endA, endA + 0.7, easeOut);
  return (
    <AbsoluteFill>
      <Bg color={P.sand}>
        <Glow x={540} y={900} r={760} o={0.55} />
      </Bg>
      {prod > 0 && (
        <AbsoluteFill style={{opacity: prod, transform: `scale(${1 + 0.05 * prog(t, s.start, phoneA, (x) => x)})`}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 1240, bottom: 0, background: P.sand2}} />
          <Abs x={90} y={250} w={900}>
            <Headline t={t} at={c(0)} lines={['Seu negócio', 'já tem valor.']} size={96} accent={['valor']} />
          </Abs>
          {[0, 1, 2].map((i) => {
            const k = prog(t, s.start + 0.2 + i * 0.25, s.start + 1 + i * 0.25, easeOut);
            const style = {opacity: k, transform: `translateY(${(1 - k) * 50}px)`};
            if (i === 0)
              return (
                <Abs key={i} x={50} y={1250 - 400 * (1004 / 1400)} style={style}>
                  <Img src={staticFile(IMG.vitaforLinha)} style={{width: 400, filter: `drop-shadow(0 16px 16px ${P.shadow})`}} />
                </Abs>
              );
            if (i === 1)
              return (
                <Abs key={i} x={400} y={800} style={{...style, transform: `${style.transform} rotate(-3deg)`}}>
                  <div style={{width: 300, height: 420, borderRadius: 18, overflow: 'hidden', position: 'relative', boxShadow: `0 24px 40px ${P.shadow}`}}>
                    <FoodTile i={0} w={300} label={false} />
                  </div>
                </Abs>
              );
            return (
              <Abs key={i} x={690} y={900} style={{...style, filter: `drop-shadow(0 16px 16px ${P.shadow})`}}>
                <Tee color={FASHION.camel} s={300} />
                <div style={{position: 'absolute', left: -20, top: 230}}>
                  <Sneaker color={FASHION.black} sole={FASHION.bg} s={300} />
                </div>
              </Abs>
            );
          })}
        </AbsoluteFill>
      )}
      {ph > 0 && (
        <AbsoluteFill style={{opacity: ph}}>
          <Trio t={t} a={phoneA - 0.2} tileK={(i) => prog(t, phoneA + 0.4 + i * 0.06, phoneA + 0.8 + i * 0.06, easeOut)} />
          <Abs x={540} y={1352} style={{transform: 'translateX(-50%)'}}>
            <DemoTag />
          </Abs>
        </AbsoluteFill>
      )}
      {end > 0 && (
        <AbsoluteFill style={{opacity: end, background: P.graphite}}>
          <Glow x={540} y={820} r={760} color="208,112,62" o={0.12} />
          <Abs x={90} y={520} w={900}>
            <Headline t={t} at={endA + 0.2} lines={['Vamos valorizar', 'a imagem do seu', 'negócio?']} size={100} color={P.cream} accent={['imagem']} accentColor={P.accentHi} />
          </Abs>
          <Abs x={90} y={950} style={{opacity: prog(t, endA + 1.2, endA + 1.9, easeOut), transform: `translateY(${(1 - prog(t, endA + 1.2, endA + 1.9, easeOut)) * 20}px)`}}>
            <div style={{fontFamily: FF.sans, fontSize: 52, fontWeight: 600, color: P.cream, letterSpacing: '-0.02em'}}>Converse com nossa equipe.</div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 18,
                marginTop: 40,
                padding: '24px 36px',
                borderRadius: 999,
                background: P.accent,
                color: P.white,
                fontFamily: FF.sans,
                fontWeight: 700,
                fontSize: 40,
              }}
            >
              <svg width={40} height={40} viewBox="0 0 24 24">
                <path d="M10 6 L4 12 L10 18 M4 12 H14 Q20 12 20 18" fill="none" stroke={P.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Responda esta mensagem
            </div>
          </Abs>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
