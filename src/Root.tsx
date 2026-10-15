import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {EffortVideo} from './EffortVideo';
import {Farmacia} from './farmacia/Farmacia';
import {FFPS, FH, FW, VT} from './farmacia/lib';
import {FPS, H, TL, W} from './lib';

export const Root: React.FC = () => (
  <>
    <Composition
      id="EffortVideo"
      component={EffortVideo}
      durationInFrames={Math.round(TL.duration * FPS)}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="FarmaciaApresentacao"
      component={Farmacia}
      durationInFrames={Math.round(VT.duration * FFPS)}
      fps={FFPS}
      width={FW}
      height={FH}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
