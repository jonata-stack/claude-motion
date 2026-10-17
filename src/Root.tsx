import React from 'react';
import {Composition, Still} from 'remotion';
import {ArticleCover} from './ArticleCover';
import {EffortVideo} from './EffortVideo';
import {AuroraTocantins} from './aurora/AuroraTocantins';
import * as AU from './aurora/theme';
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
      id="AuroraTocantins"
      component={AuroraTocantins}
      durationInFrames={Math.round(AU.TL.duration * AU.FPS)}
      fps={AU.FPS}
      width={AU.W}
      height={AU.H}
    />
    <Still id="ArticleCover" component={ArticleCover} width={2000} height={800} />
  </>
);
