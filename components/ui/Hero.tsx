'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getGsap } from '@/lib/gsap';
import { useScrollStore } from '@/lib/store';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './Hero.module.css';

const HeroCanvas = dynamic(() => import('@/components/canvas/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    />
  ),
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const updateScrollProgress = useScrollStore(state => state.updateProgress);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      updateScrollProgress(0);
    }
  }, [prefersReducedMotion, updateScrollProgress]);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) {
      return;
    }

    const gsap = getGsap();
    const animations: Array<gsap.core.Tween | gsap.core.Timeline> = [];

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: self => {
            updateScrollProgress(self.progress);
          },
        },
      });
      animations.push(timeline);

      if (titleRef.current) {
        const introTitle = gsap
          .timeline()
          .set(titleRef.current, { opacity: 0, y: 40 })
          .to(titleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.3,
          });
        animations.push(introTitle);

        timeline.to(titleRef.current, {
          y: -100,
          opacity: 0,
          ease: 'power2.in',
        });
      }

      if (subtitleRef.current) {
        const introSubtitle = gsap
          .timeline()
          .set(subtitleRef.current, { opacity: 0, y: 30 })
          .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.5,
          });
        animations.push(introSubtitle);

        timeline.to(
          subtitleRef.current,
          {
            y: -80,
            opacity: 0,
            ease: 'power2.in',
          },
          '<'
        );
      }

      if (ctaRef.current) {
        const introCta = gsap
          .timeline()
          .set(ctaRef.current, { opacity: 0, y: 20 })
          .to(ctaRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.7,
          });
        animations.push(introCta);

        timeline.to(
          ctaRef.current,
          {
            y: -60,
            opacity: 0,
            ease: 'power2.in',
          },
          '<'
        );
      }
    }, sectionRef);

    return () => {
      context.revert();
      animations.forEach(animation => animation.kill());
    };
  }, [updateScrollProgress, prefersReducedMotion]);

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div className={styles.canvasContainer}>
        <HeroCanvas className={styles.canvas} />
      </div>

      <div className={styles.content}>
        <h1 ref={titleRef} className={styles.title}>
          Immersive
          <br />
          Digital Experiences
        </h1>

        <p ref={subtitleRef} className={styles.subtitle}>
          Crafted with cutting-edge technologies
        </p>

        <div ref={ctaRef} className={styles.cta}>
          <button className={styles.button}>Explore</button>
        </div>
      </div>
    </section>
  );
}
