import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {easeOut, prog} from '../lib';
import {Block, Captions, Icon, inOut, Photo, pick, Row, Scrim, Slot} from './parts';
import {Mapa} from './Mapa';
import {C, F, FOTOS, FPS, SAFE, TL} from './theme';

const useAuroraFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('italic 400 100px "Instrument Serif"'),
      document.fonts.load('600 20px "Inter Variable"'),
      document.fonts.load('760 20px "Inter Variable"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};

type Shot = {slot: Slot | 'mapa'; from: number; to: number; zoom?: [number, number]; drift?: [number, number]};

const X = TL.xfade;
const SHOTS: Shot[] = [
  {slot: 'paisagem', from: 0, to: TL.s2.start, zoom: [1.0, 1.1]},
  {slot: 'terreno1', from: TL.s2.start, to: TL.s2.photoB, drift: [-60, 0]},
  {slot: 'terreno2', from: TL.s2.photoB, to: TL.s3.start, drift: [60, 0]},
  {slot: pick('rio', 'area'), from: TL.s3.start, to: TL.s3.photoB, zoom: [1.03, 1.11]},
  {slot: pick('rio', 'area2'), from: TL.s3.photoB, to: TL.s4.start, drift: [70, 0]},
  {slot: 'casa1', from: TL.s4.start, to: TL.s4.photoB},
  {slot: 'casa2', from: TL.s4.photoB, to: TL.s4.photoC, drift: [-50, 0]},
  {slot: 'casa3', from: TL.s4.photoC, to: TL.s5.start},
  {slot: 'mapa', from: TL.s5.start, to: TL.s6.start},
  {slot: 'geral', from: TL.s6.start, to: TL.s7.start, zoom: [1.02, 1.1]},
  {slot: 'final', from: TL.s7.start, to: TL.duration, zoom: [1.0, 1.04]},
];

const serifAccent: React.CSSProperties = {
  fontFamily: F.serif,
  fontStyle: 'italic',
  fontWeight: 400,
  color: C.gold,
  letterSpacing: '-0.01em',
};

/** Room name over a house photo, only when fotos.json gives one. */
const RoomLabel: React.FC<{t: number; slot: Slot; from: number; to: number}> = ({t, slot, from, to}) => {
  const label = (FOTOS[slot] as {label?: string | null}).label;
  if (!label) return null;
  const {k} = inOut(t, from + 0.5, to - 0.1, 0.6, 0.35);
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        top: SAFE.bottom - 270,
        padding: '12px 24px',
        borderRadius: 999,
        background: C.shade,
        color: C.cream,
        fontFamily: F.sans,
        fontSize: 38,
        fontWeight: 600,
        opacity: k,
      }}
    >
      {label}
    </div>
  );
};

export const AuroraTocantins: React.FC = () => {
  useAuroraFonts();
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const {s1, s2, s3, s4, s5, s6, s7} = TL;

  return (
    <AbsoluteFill style={{background: C.forest}}>
      {SHOTS.map((sh, i) => {
        if (t < sh.from - (i ? X : 0) || t > sh.to + X) return null;
        const fade = i === 0 ? 1 : prog(t, sh.from - X / 2, sh.from + X / 2);
        return (
          <AbsoluteFill key={i} style={{opacity: fade}}>
            {sh.slot === 'mapa' ? (
              <Mapa frame={frame} t={t} />
            ) : (
              <Photo slot={sh.slot} t={t} from={sh.from - X} to={sh.to + X} zoom={sh.zoom} drift={sh.drift} />
            )}
          </AbsoluteFill>
        );
      })}
      <Scrim top={t > s5.start && t < s6.start ? 0.3 : 1} />

      {/* 0–6 s */}
      <Block t={t} at={s1.title} until={s2.start - 0.15} top={SAFE.top + 70}>
        <div style={{...serifAccent, fontSize: 150, lineHeight: 0.95}}>Seu refúgio</div>
        <div style={{fontSize: 78, fontWeight: 760, letterSpacing: '-0.025em', lineHeight: 1.05, marginTop: 18}}>
          em Aurora
          <br />
          do Tocantins
        </div>
      </Block>

      {/* 6–14 s */}
      <Block t={t} at={s2.chips[0] - 0.2} until={s3.start - 0.15}>
        <Row t={t} at={s2.chips[0]} icon={<Icon name="area" />} size={92}>
          <span style={{color: C.gold}}>19</span> hectares
        </Row>
        <Row t={t} at={s2.chips[1]} icon={<Icon name="serra" />}>
          Serras Gerais
        </Row>
        <Row t={t} at={s2.chips[2]} icon={<Icon name="pin" />}>
          Tocantins
        </Row>
      </Block>

      {/* 14–23 s */}
      <Block t={t} at={s3.text} until={s4.start - 0.15}>
        <div style={{fontSize: 56, fontWeight: 600, color: C.creamDim}}>Cerca de</div>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, color: C.gold}}>
          600 metros
        </div>
        <div style={{fontSize: 64, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12, marginTop: 12}}>
          de trecho do <span style={{...serifAccent, fontSize: 84}}>Rio Palma</span>
          <br />
          na área
        </div>
      </Block>

      {/* 23–34 s */}
      <Block t={t} at={s4.items[0] - 0.2} until={s5.start - 0.15}>
        <Row t={t} at={s4.items[0]} icon={<Icon name="casa" />} size={66}>
          Casa principal
          <div style={{fontSize: 52, fontWeight: 600, color: C.creamDim}}>4 quartos</div>
        </Row>
        <Row t={t} at={s4.items[1]} icon={<Icon name="cama" />} size={66}>
          3 suítes adicionais
        </Row>
        <Row t={t} at={s4.items[2]} icon={<Icon name="chave" />} size={66}>
          Casa de caseiro
        </Row>
      </Block>
      {SHOTS.slice(5, 8).map((sh) => (
        <RoomLabel key={sh.slot} t={t} slot={sh.slot as Slot} from={sh.from} to={sh.to} />
      ))}

      {/* 34–45 s: map */}
      <Block t={t} at={s5.facts[0]} until={s6.start - 0.15}>
        <Row t={t} at={s5.facts[0]} size={60}>
          Aprox. <span style={{color: C.gold}}>9 km</span> de Aurora
        </Row>
        <Row t={t} at={s5.facts[1]} size={60}>
          <span style={{color: C.water}}>20 min</span> do Rio Azuis
        </Row>
      </Block>
      <Block t={t} at={s5.access} until={s6.start - 0.15} top={1190}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            fontSize: 42,
            fontWeight: 650,
            lineHeight: 1.2,
          }}
        >
          <div style={{width: 96, height: 96, flex: 'none'}}>
            <Icon name="estrada" />
          </div>
          Acesso com aproximadamente 4 km de estrada de terra
        </div>
      </Block>

      {/* 45–53 s */}
      <Block t={t} at={s6.price} until={s7.start - 0.15} top={SAFE.top + 60}>
        <div style={{fontSize: 46, fontWeight: 600, color: C.creamDim, letterSpacing: '0.02em'}}>Disponível por</div>
        <div style={{fontSize: 136, fontWeight: 800, letterSpacing: '-0.045em', lineHeight: 1.02, color: C.gold, whiteSpace: 'nowrap'}}>
          R$ 2.000.000
        </div>
      </Block>
      <Block t={t} at={s6.doc} until={s7.start - 0.15} top={SAFE.top + 300} style={{textShadow: 'none'}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 22,
            padding: '24px 32px',
            borderRadius: 26,
            background: C.scrim,
            fontSize: 46,
            fontWeight: 650,
            lineHeight: 1.25,
          }}
        >
          <div style={{width: 96, height: 96, flex: 'none'}}>
            <Icon name="doc" />
          </div>
          <div>
            Documento de posse
            <div style={{color: C.creamDim, fontWeight: 600}}>Regularização fundiária em andamento</div>
          </div>
        </div>
      </Block>

      {/* 53–60 s */}
      <Block t={t} at={s7.cta} until={TL.duration + 1} top={SAFE.top + 70}>
        <div style={{fontSize: 70, fontWeight: 760, letterSpacing: '-0.025em', lineHeight: 1.08}}>
          Peça mais informações
          <br />e <span style={{...serifAccent, fontSize: 96}}>agende sua visita</span>
        </div>
      </Block>
      <Block t={t} at={s7.phone} until={TL.duration + 1} top={SAFE.top + 330} style={{textShadow: 'none'}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 22,
            padding: '20px 40px 20px 26px',
            borderRadius: 999,
            background: C.gold,
            color: C.forest,
            fontSize: 74,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            transform: `scale(${0.94 + 0.06 * prog(t, s7.phone, s7.phone + 1, easeOut)})`,
            transformOrigin: '0% 50%',
          }}
        >
          <svg viewBox="0 0 96 96" width={78} height={78}>
            <path
              d="M30 14h-8a8 8 0 0 0-8 9c3 32 27 56 59 59a8 8 0 0 0 9-8v-8a6 6 0 0 0-5-6l-12-3a6 6 0 0 0-6 2l-5 5a48 48 0 0 1-20-20l5-5a6 6 0 0 0 2-6l-3-12a6 6 0 0 0-6-5Z"
              fill="none"
              stroke={C.forest}
              strokeWidth={7}
              strokeLinejoin="round"
            />
          </svg>
          (61) 99876-1818
        </div>
      </Block>

      <Captions t={t} />
      <Audio src={staticFile('aurora/aurora.wav')} />
    </AbsoluteFill>
  );
};
