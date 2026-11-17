import '@fontsource/archivo-black/400.css';
import '@fontsource/fraunces/800.css';
import '@fontsource-variable/inter';
import {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';

export const useFarmaciaFonts = () => {
  const [handle] = useState(() => delayRender('farmacia fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('400 40px "Archivo Black"'),
      document.fonts.load('800 40px "Fraunces"'),
      document.fonts.load('600 20px "Inter Variable"'),
      document.fonts.load('700 20px "Inter Variable"'),
    ]).then(() => continueRender(handle));
  }, [handle]);
};
