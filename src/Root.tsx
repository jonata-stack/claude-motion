import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {EffortVideo} from './EffortVideo';
import {DunaAcai} from './duna/DunaAcai';
import {DH, DTL, DW} from './duna/lib';
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
      id="DunaAcai"
      component={DunaAcai}
      durationInFrames={Math.round(DTL.duration * DTL.fps)}
      fps={DTL.fps}
      width={DW}
      height={DH}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
