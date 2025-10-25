import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import SmoothScroller from '@/components/ui/SmoothScroller';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Lusion-inspired Hero',
  description: 'Next.js + R3F baseline with a cinematic hero animation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SmoothScroller>{children}</SmoothScroller>
      </body>
    </html>
  );
}
