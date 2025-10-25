'use client';

import { create } from 'zustand';

interface CursorState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  updatePosition: (x: number, y: number) => void;
}

export const useCursorStore = create<CursorState>((set, get) => ({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  updatePosition: (x: number, y: number) => {
    const { position } = get();
    const velocity = {
      x: x - position.x,
      y: y - position.y,
    };
    set({ position: { x, y }, velocity });
  },
}));

interface ScrollState {
  progress: number;
  updateProgress: (progress: number) => void;
}

export const useScrollStore = create<ScrollState>(set => ({
  progress: 0,
  updateProgress: (progress: number) => set({ progress }),
}));
