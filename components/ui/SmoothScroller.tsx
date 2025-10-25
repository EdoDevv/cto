'use client';

import { useLenis } from '@/hooks/useLenis';

export default function SmoothScroller({ children }: { children: React.ReactNode }) {
  useLenis();

  return <>{children}</>;
}
