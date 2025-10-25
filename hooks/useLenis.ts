'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
};
