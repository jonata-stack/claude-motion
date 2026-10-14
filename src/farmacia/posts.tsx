import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp01} from '../lib';
import {FASHION, FF, FOOD, IMG, P, PHARMA} from './lib';
import {BOX_RATIO} from './ui';

const fill: React.CSSProperties = {position: 'absolute', inset: 0};

const Pic: React.FC<{src: string; style?: React.CSSProperties}> = ({src, style}) => (
  <Img src={staticFile(src)} style={{position: 'absolute', objectFit: 'cover', ...style}} />
);

/* ---------------------------------------------------------------- pharmacy (green, real products) */

export type PharmaKind = 'calcium' | 'aroeira' | 'sulfuroso' | 'team' | 'shelf' | 'hours' | 'k2' | 'artro' | 'd3' | 'vitafor' | 'catarinense';

export const PharmaMark: React.FC<{s: number; color?: string}> = ({s, color = PHARMA.green}) => (
  <svg width={s} height={s} viewBox="0 0 40 40">
    <rect x={0} y={0} width={40} height={40} rx={12} fill={color} />
    <path d="M16 9h8v7h7v8h-7v7h-8v-7H9v-8h7z" fill={PHARMA.bg} />
  </svg>
);

const PharmaFrame: React.FC<{w: number; title: string; sub?: string; dark?: boolean; children?: React.ReactNode}> = ({
  w,
  title,
  sub,
  dark,
  children,
}) => (
  <div style={{...fill, background: dark ? PHARMA.green : PHARMA.bg, overflow: 'hidden'}}>
    {children}
    <div style={{position: 'absolute', left: w * 0.07, top: w * 0.07, right: w * 0.07}}>
      <div style={{display: 'flex', alignItems: 'center', gap: w * 0.03, marginBottom: w * 0.035}}>
        <PharmaMark s={w * 0.07} color={dark ? PHARMA.bg : PHARMA.green} />
        <div style={{height: w * 0.008, width: w * 0.12, background: dark ? PHARMA.mint : PHARMA.green, opacity: 0.6, borderRadius: 9}} />
      </div>
      <div
        style={{
          fontFamily: FF.sans,
          fontWeight: 760,
          fontSize: w * 0.085,
          letterSpacing: '-0.03em',
          lineHeight: 1.02,
          color: dark ? PHARMA.bg : PHARMA.ink,
        }}
      >
        {title}
      </div>
      {sub && (
        <div style={{fontFamily: FF.sans, fontWeight: 500, fontSize: w * 0.045, marginTop: w * 0.025, color: dark ? PHARMA.mint : PHARMA.greenHi}}>
          {sub}
        </div>
      )}
    </div>
  </div>
);

const Boxes: React.FC<{w: number; srcs: (keyof typeof BOX_RATIO)[]; bottom: number; bw: number}> = ({w, srcs, bottom, bw}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: w * 0.025}}>
    {srcs.map((s) => (
      <Img
        key={s}
        src={staticFile(IMG[s])}
        style={{width: bw, height: bw * BOX_RATIO[s], borderRadius: 3, boxShadow: `0 ${w * 0.02}px ${w * 0.04}px rgba(20,35,28,0.28)`}}
      />
    ))}
  </div>
);

export const PharmaTile: React.FC<{kind: PharmaKind; w: number}> = ({kind, w}) => {
  if (kind === 'vitafor' || kind === 'catarinense')
    return (
      <PharmaFrame w={w} title={kind === 'vitafor' ? 'Linha Vitafor' : 'Linha Catarinense'} sub="Suplementos • na prateleira" dark={kind === 'catarinense'}>
        <div
          style={{
            position: 'absolute',
            left: w * 0.07,
            right: w * 0.07,
            bottom: w * 0.07,
            height: w * 0.52,
            borderRadius: w * 0.035,
            overflow: 'hidden',
            background: P.white,
            boxShadow: `0 ${w * 0.02}px ${w * 0.05}px rgba(20,35,28,0.25)`,
          }}
        >
          <Img src={staticFile(IMG[kind])} style={{...fill, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 60%'}} />
        </div>
      </PharmaFrame>
    );
  if (kind === 'calcium')
    return (
      <PharmaFrame w={w} title="Linha Calcium maxx" sub="Encontre na loja">
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: w * 0.2, background: PHARMA.mint}} />
        <Boxes w={w} srcs={['d3', 'k2', 'artro']} bottom={w * 0.08} bw={w * 0.27} />
      </PharmaFrame>
    );
  if (kind === 'k2' || kind === 'artro' || kind === 'd3')
    return (
      <PharmaFrame w={w} title="Calcium maxx" sub="Suplemento alimentar">
        <div style={{position: 'absolute', left: w * 0.5, top: w * 0.55, width: w * 0.9, height: w * 0.9, marginLeft: -w * 0.45, borderRadius: '50%', background: PHARMA.mint}} />
        <Boxes w={w} srcs={[kind]} bottom={w * 0.07} bw={w * 0.36} />
      </PharmaFrame>
    );
  if (kind === 'aroeira' || kind === 'sulfuroso')
    return (
      <PharmaFrame w={w} title={kind === 'aroeira' ? 'Sabonete de Aroeira' : 'Sabonete Sulfuroso'} sub="Arte Nativa • na prateleira" dark={kind === 'aroeira'}>
        <Img
          src={staticFile(IMG[kind])}
          style={{
            position: 'absolute',
            left: w * 0.14,
            bottom: w * 0.1,
            width: w * 0.72,
            height: w * 0.72 * BOX_RATIO[kind],
            borderRadius: 4,
            boxShadow: `0 ${w * 0.03}px ${w * 0.06}px rgba(0,0,0,0.3)`,
            transform: 'rotate(-4deg)',
          }}
        />
      </PharmaFrame>
    );
  if (kind === 'team')
    return (
      <PharmaFrame w={w} title="Conheça nossa equipe" sub="Atendimento de perto">
        <svg viewBox="0 0 100 60" style={{position: 'absolute', left: 0, bottom: 0, width: w, height: w * 0.6}}>
          <rect x={0} y={40} width={100} height={20} fill={PHARMA.green} />
          <rect x={0} y={38} width={100} height={4} fill={PHARMA.greenHi} />
          {[24, 50, 76].map((cx, i) => (
            <g key={i}>
              <rect x={cx - 9} y={22} width={18} height={20} rx={8} fill={i === 1 ? P.white : PHARMA.mint} />
              <circle cx={cx} cy={15} r={6.5} fill={[P.skinA, P.skinB, P.skinADark][i]} />
            </g>
          ))}
        </svg>
      </PharmaFrame>
    );
  if (kind === 'shelf')
    return (
      <PharmaFrame w={w} title="Novidades na prateleira" dark>
        <div style={{position: 'absolute', left: w * 0.06, right: w * 0.06, bottom: w * 0.1, height: w * 0.025, background: PHARMA.mint, borderRadius: 4}} />
        <Boxes w={w} srcs={['k2', 'artro']} bottom={w * 0.125} bw={w * 0.25} />
      </PharmaFrame>
    );
  return (
    <PharmaFrame w={w} title="Horário de atendimento" sub="Seg a sáb">
      <svg viewBox="0 0 40 40" style={{position: 'absolute', left: w * 0.33, bottom: w * 0.1, width: w * 0.34}}>
        <circle cx={20} cy={20} r={17} fill="none" stroke={PHARMA.green} strokeWidth={3} />
        <path d="M20 10v10l7 4" stroke={PHARMA.green} strokeWidth={3} strokeLinecap="round" fill="none" />
      </svg>
    </PharmaFrame>
  );
};

/* ---------------------------------------------------------------- "before": real photos, no shared look (food demo) */

/** Tight crop of a food photo; the zoom keeps the source art's logo and lettering out of frame. */
const Crop: React.FC<{src: string; pos: string; zoom: number; style?: React.CSSProperties; filter?: string}> = ({src, pos, zoom, style, filter}) => (
  <div style={{position: 'absolute', overflow: 'hidden', ...style}}>
    <Img src={staticFile(src)} style={{...fill, width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos, filter}} />
  </div>
);

export const BeforeTile: React.FC<{i: number; w: number}> = ({i, w}) => {
  const kinds = [
    <div key={0} style={{...fill, background: '#F1D7DF'}}>
      <Crop src={IMG.acaiBanana} pos="50% 55%" zoom={1.15} style={{left: '16%', top: '28%', width: '68%', height: '62%', transform: 'rotate(8deg)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: '6%', textAlign: 'center', fontFamily: FF.baloo, fontWeight: 800, fontSize: w * 0.13, color: '#C2185B'}}>
        CHEGOU!
      </div>
    </div>,
    <div key={1} style={{...fill, background: '#ECECEC'}}>
      <Crop src={IMG.acaiKiwi} pos="60% 22%" zoom={1.7} style={{inset: 0}} filter="saturate(0.5) brightness(1.15)" />
    </div>,
    <div key={2} style={{...fill, background: '#2C4F9E'}}>
      <div style={{position: 'absolute', inset: '14%', fontFamily: FF.serif, fontSize: w * 0.16, color: '#FFE36E', lineHeight: 1, textAlign: 'center'}}>
        Bom dia, clientes!
      </div>
    </div>,
    <div key={3} style={{...fill, background: '#FFF6D6'}}>
      <Crop src={IMG.acaiUva} pos="55% 18%" zoom={1.7} style={{left: '-6%', top: '30%', width: '70%', height: '62%', transform: 'rotate(-12deg)'}} />
      <div style={{position: 'absolute', right: '6%', top: '8%', fontFamily: FF.anton, fontSize: w * 0.12, color: '#E86A1C'}}>CONFIRA</div>
    </div>,
    <div key={4} style={{...fill, background: '#DCDCDC'}}>
      <Crop src={IMG.acaiUva} pos="55% 18%" zoom={2.2} style={{inset: 0}} filter="brightness(0.8) contrast(0.85)" />
    </div>,
    <div key={5} style={{...fill, background: '#7A3FA0'}}>
      <div style={{position: 'absolute', inset: '18%', fontFamily: FF.sans, fontWeight: 900, fontSize: w * 0.12, color: '#FFFFFF', fontStyle: 'italic', textAlign: 'center'}}>
        Venha nos visitar
      </div>
    </div>,
    <div key={6} style={{...fill, background: '#F4F4F4'}}>
      <Crop src={IMG.acaiColher} pos="30% 70%" zoom={1.6} style={{left: '20%', top: '15%', width: '60%', height: '70%', transform: 'rotate(90deg)'}} />
    </div>,
    <div key={7} style={{...fill, background: '#B9E4F0'}}>
      <Crop src={IMG.acaiBanana} pos="50% 55%" zoom={1.3} style={{inset: 0}} filter="hue-rotate(40deg) saturate(1.4)" />
    </div>,
    <div key={8} style={{...fill, background: '#FFFFFF'}}>
      <div style={{position: 'absolute', left: '10%', top: '35%', fontFamily: FF.mono, fontSize: w * 0.09, color: '#333'}}>promo da semana</div>
    </div>,
  ];
  return kinds[i % kinds.length];
};

/* ---------------------------------------------------------------- food (açaí demo) */

export const FoodTile: React.FC<{i: number; w: number; label?: boolean}> = ({i, w, label = true}) => {
  const items = [
    {src: IMG.acaiBanana, text: 'Monte do seu jeito', pos: '50% 55%', zoom: 1.1},
    {src: IMG.acaiKiwi, text: 'Frutas da estação', pos: '60% 22%', zoom: 1.7},
    {src: IMG.acaiUva, text: 'Detalhe que dá vontade', pos: '55% 18%', zoom: 1.7},
    {src: IMG.acaiColher, text: 'Na colher', pos: '30% 70%', zoom: 1.6},
  ];
  const it = items[i % items.length];
  return (
    <div style={{...fill, background: FOOD.bg, overflow: 'hidden'}}>
      <Img src={staticFile(it.src)} style={{...fill, width: '100%', height: '100%', objectFit: 'cover', objectPosition: it.pos, transform: `scale(${it.zoom})`, transformOrigin: it.pos}} />
      <div style={{...fill, background: `linear-gradient(180deg, rgba(43,10,27,0.0) 45%, rgba(43,10,27,0.92) 100%)`}} />
      {label && (
        <div
          style={{
            position: 'absolute',
            left: w * 0.07,
            right: w * 0.07,
            bottom: w * 0.07,
            fontFamily: FF.anton,
            fontSize: w * 0.105,
            lineHeight: 1,
            color: FOOD.cream,
            textTransform: 'uppercase',
          }}
        >
          {it.text}
          <div style={{width: w * 0.16, height: w * 0.018, background: FOOD.gold, marginTop: w * 0.03, borderRadius: 9}} />
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------- fashion (illustrated pieces) */

export const Tee: React.FC<{color: string; s: number}> = ({color, s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M30 12 L40 8 Q50 16 60 8 L70 12 L92 28 L82 44 L72 38 L72 92 L28 92 L28 38 L18 44 L8 28 Z" fill={color} />
    <path d="M40 8 Q50 20 60 8" stroke="rgba(0,0,0,0.18)" strokeWidth={2} fill="none" />
  </svg>
);
export const Pants: React.FC<{color: string; s: number}> = ({color, s}) => (
  <svg width={s * 0.6} height={s} viewBox="0 0 60 100">
    <path d="M8 4 H52 L56 96 H36 L30 34 L24 96 H4 Z" fill={color} />
    <path d="M8 4 H52 V12 H8 Z" fill="rgba(0,0,0,0.15)" />
  </svg>
);
export const Sneaker: React.FC<{color: string; sole?: string; s: number}> = ({color, sole = '#FFFFFF', s}) => (
  <svg width={s} height={s * 0.5} viewBox="0 0 100 50">
    <path d="M6 30 Q8 12 22 10 L40 8 Q48 22 66 24 L90 30 Q96 34 94 40 L6 40 Z" fill={color} />
    <rect x={4} y={38} width={92} height={8} rx={4} fill={sole} />
    <path d="M30 14 L46 22 M34 10 L50 18" stroke={sole} strokeWidth={2.5} />
  </svg>
);
export const Bag: React.FC<{color: string; s: number}> = ({color, s}) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M32 34 Q32 12 50 12 Q68 12 68 34" stroke={color} strokeWidth={6} fill="none" />
    <rect x={18} y={32} width={64} height={56} rx={10} fill={color} />
  </svg>
);

export const FashionTile: React.FC<{i: number; w: number}> = ({i, w}) => {
  const looks = [
    {bg: FASHION.bg, title: 'Nova coleção', el: <><Tee color={FASHION.camel} s={w * 0.42} /><Pants color={FASHION.black} s={w * 0.42} /></>},
    {bg: FASHION.stone, title: 'Combinação da semana', el: <><Tee color={FASHION.bg} s={w * 0.4} /><Sneaker color={FASHION.black} s={w * 0.36} /></>},
    {bg: FASHION.black, title: 'Detalhes', el: <Sneaker color={FASHION.camel} sole={FASHION.bg} s={w * 0.62} />, dark: true},
    {bg: FASHION.bg, title: 'Para o dia a dia', el: <><Bag color={FASHION.olive} s={w * 0.34} /><Tee color={FASHION.black} s={w * 0.38} /></>},
  ];
  const l = looks[i % looks.length];
  return (
    <div style={{...fill, background: l.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: w * 0.08, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: w * 0.02}}>
        {l.el}
      </div>
      <div
        style={{
          position: 'absolute',
          left: w * 0.08,
          top: w * 0.07,
          fontFamily: FF.serif,
          fontSize: w * 0.13,
          lineHeight: 0.95,
          color: l.dark ? FASHION.bg : FASHION.black,
          width: w * 0.8,
        }}
      >
        {l.title}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- profile screen */

export type Brand = {
  handle: string;
  name: string;
  avatar: React.ReactNode;
  bio: string[];
  hl: {label: string; color: string}[];
  accent: string;
  font?: string;
};

/** Generic social profile: header, bio, highlight circles and a 3-column grid. No real app branding. */
export const Profile: React.FC<{
  w: number;
  brand: Brand;
  tile: (i: number, size: number) => React.ReactNode;
  tileK?: (i: number) => number;
  rows?: number;
  headerK?: number;
}> = ({w, brand, tile, tileK = () => 1, rows = 4, headerK = 1}) => {
  const pad = w * 0.05;
  const gap = w * 0.008;
  const size = (w - gap * 2) / 3;
  return (
    <div style={{position: 'absolute', inset: 0, background: P.white, fontFamily: FF.sans, color: P.ink}}>
      <div style={{opacity: headerK}}>
        <div style={{height: w * 0.17}} />
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${pad}px`, height: w * 0.1}}>
          <div style={{fontWeight: 700, fontSize: w * 0.052}}>{brand.handle}</div>
          <div style={{display: 'flex', gap: w * 0.04}}>
            {[0, 1].map((i) => (
              <div key={i} style={{width: w * 0.055, height: w * 0.055, borderRadius: w * 0.015, border: `${w * 0.007}px solid ${P.ink}`}} />
            ))}
          </div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: w * 0.05, padding: `${w * 0.02}px ${pad}px`}}>
          <div
            style={{
              width: w * 0.22,
              height: w * 0.22,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              boxShadow: `0 0 0 ${w * 0.008}px ${P.white}, 0 0 0 ${w * 0.016}px ${brand.accent}`,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div style={{transform: `scale(${(w * 0.22) / 200})`}}>{brand.avatar}</div>
          </div>
          <div>
            <div style={{fontWeight: 750, fontSize: w * 0.055, fontFamily: brand.font ?? FF.sans, letterSpacing: '-0.01em'}}>{brand.name}</div>
            {brand.bio.map((b, i) => (
              <div key={i} style={{fontSize: w * 0.038, opacity: 0.72, marginTop: w * 0.008}}>
                {b}
              </div>
            ))}
          </div>
        </div>
        <div style={{display: 'flex', gap: w * 0.045, padding: `${w * 0.035}px ${pad}px`}}>
          {brand.hl.map((h, i) => (
            <div key={i} style={{textAlign: 'center', width: w * 0.15}}>
              <div
                style={{
                  width: w * 0.15,
                  height: w * 0.15,
                  borderRadius: '50%',
                  background: h.color,
                  boxShadow: `0 0 0 ${w * 0.006}px ${P.white}, 0 0 0 ${w * 0.01}px ${P.inkFaint}`,
                }}
              />
              <div style={{fontSize: w * 0.03, marginTop: w * 0.015, whiteSpace: 'nowrap'}}>{h.label}</div>
            </div>
          ))}
        </div>
        <div style={{display: 'flex', borderTop: `1px solid ${P.inkFaint}`, borderBottom: `1px solid ${P.inkFaint}`}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{flex: 1, height: w * 0.085, display: 'grid', placeItems: 'center'}}>
              <div
                style={{
                  width: w * 0.045,
                  height: w * 0.045,
                  border: `${w * 0.006}px solid ${i === 0 ? P.ink : 'rgba(28,29,31,0.35)'}`,
                  borderRadius: i === 1 ? '50%' : w * 0.008,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: `repeat(3, ${size}px)`, gap, marginTop: gap}}>
        {Array.from({length: rows * 3}, (_, i) => {
          const k = clamp01(tileK(i));
          return (
            <div key={i} style={{width: size, height: size, position: 'relative', overflow: 'hidden', background: '#EEE'}}>
              <div style={{position: 'absolute', inset: 0, opacity: k, transform: `scale(${1.15 - 0.15 * k})`}}>{tile(i, size)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PHARMA_BRAND: Brand = {
  handle: 'sua.farmacia',
  name: 'Sua Farmácia',
  avatar: <PharmaMark s={200} />,
  bio: ['Farmácia de bairro', 'Atendimento de perto'],
  hl: [
    {label: 'Produtos', color: PHARMA.green},
    {label: 'Equipe', color: PHARMA.mint},
    {label: 'Horários', color: PHARMA.greenHi},
    {label: 'Novidades', color: P.sand},
  ],
  accent: PHARMA.green,
};
export const PHARMA_GRID: PharmaKind[] = ['vitafor', 'team', 'catarinense', 'calcium', 'hours', 'vitafor', 'catarinense', 'shelf', 'd3', 'team', 'vitafor', 'k2'];

export const FoodMark: React.FC<{s: number}> = ({s}) => (
  <div style={{width: s, height: s, background: FOOD.pink, display: 'grid', placeItems: 'center', fontFamily: FF.baloo, fontWeight: 800, fontSize: s * 0.42, color: FOOD.cream}}>
    açaí
  </div>
);
export const FashionMark: React.FC<{s: number}> = ({s}) => (
  <div style={{width: s, height: s, background: FASHION.black, display: 'grid', placeItems: 'center', fontFamily: FF.serif, fontSize: s * 0.5, color: FASHION.bg}}>
    Aa
  </div>
);

export const FOOD_BRAND: Brand = {
  handle: 'seu.acai',
  name: 'Seu Açaí',
  avatar: <FoodMark s={200} />,
  bio: ['Açaí e cremes', 'Monte do seu jeito'],
  hl: [
    {label: 'Cardápio', color: FOOD.pink},
    {label: 'Preparo', color: FOOD.gold},
    {label: 'Copos', color: FOOD.wine},
    {label: 'Loja', color: '#F7B6CB'},
  ],
  accent: FOOD.pink,
  font: FF.baloo,
};
export const FASHION_BRAND: Brand = {
  handle: 'sua.loja',
  name: 'Sua Loja',
  avatar: <FashionMark s={200} />,
  bio: ['Roupas e calçados', 'Novidades toda semana'],
  hl: [
    {label: 'Coleção', color: FASHION.camel},
    {label: 'Calçados', color: FASHION.black},
    {label: 'Looks', color: FASHION.stone},
    {label: 'Loja', color: FASHION.olive},
  ],
  accent: FASHION.black,
  font: FF.serif,
};

/** A single feed post as it looks on the phone: header, square art, actions, caption lines. */
export const FeedScreen: React.FC<{w: number; brand: Brand; children: React.ReactNode; captionK?: number}> = ({w, brand, children, captionK = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: P.white, fontFamily: FF.sans, color: P.ink}}>
    <div style={{height: w * 0.2}} />
    <div style={{display: 'flex', alignItems: 'center', gap: w * 0.03, padding: `0 ${w * 0.04}px`, height: w * 0.14}}>
      <div style={{width: w * 0.09, height: w * 0.09, borderRadius: '50%', overflow: 'hidden', display: 'grid', placeItems: 'center'}}>
        <div style={{transform: `scale(${(w * 0.09) / 200})`}}>{brand.avatar}</div>
      </div>
      <div style={{fontWeight: 700, fontSize: w * 0.042}}>{brand.handle}</div>
    </div>
    <div style={{width: w, height: w, position: 'relative', overflow: 'hidden'}}>{children}</div>
    <div style={{display: 'flex', gap: w * 0.04, padding: `${w * 0.035}px ${w * 0.04}px`}}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{width: w * 0.06, height: w * 0.06, borderRadius: i === 0 ? '50%' : w * 0.012, border: `${w * 0.007}px solid ${P.ink}`}} />
      ))}
    </div>
    <div style={{padding: `0 ${w * 0.04}px`, opacity: captionK}}>
      {[0.9, 0.75, 0.5].map((l, i) => (
        <div key={i} style={{height: w * 0.022, width: `${l * 100}%`, background: P.inkFaint, borderRadius: 9, marginBottom: w * 0.02}} />
      ))}
    </div>
  </div>
);
