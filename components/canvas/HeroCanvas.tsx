'use client';

import Image from 'next/image';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type PointerEventHandler } from 'react';
import * as THREE from 'three';

import { useCursorStore, useScrollStore } from '@/lib/store';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import fragmentShader from '@/shaders/hero.frag';
import vertexShader from '@/shaders/hero.vert';

const MOBILE_BREAKPOINT = 768;

const createGradientTexture = (size = 512) => {
  const colorStart = new THREE.Color('#1a1a2e');
  const colorEnd = new THREE.Color('#16213e');
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const idx = (y * size + x) * 4;
      const t = (x + y) / (size * 2);
      const mixed = colorStart.clone().lerp(colorEnd, t);

      data[idx] = mixed.r * 255;
      data[idx + 1] = mixed.g * 255;
      data[idx + 2] = mixed.b * 255;
      data[idx + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 4;
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;

  return texture;
};

const createNoiseTexture = (size = 256) => {
  const data = new Uint8Array(size * size * 4);

  for (let i = 0; i < size * size; i += 1) {
    const value = Math.random() * 255;
    data[i * 4] = value;
    data[i * 4 + 1] = value;
    data[i * 4 + 2] = value;
    data[i * 4 + 3] = 255;
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return texture;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

const HeroPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const accumulator = useRef(0);
  const { viewport } = useThree();
  const cursorVelocity = useCursorStore(state => state.velocity);
  const scrollProgress = useScrollStore(state => state.progress);
  const isMobile = useIsMobile();

  const { gradientTexture, noiseTexture } = useMemo(() => {
    const gradient = createGradientTexture(isMobile ? 256 : 512);
    const noise = createNoiseTexture(isMobile ? 128 : 256);

    return { gradientTexture: gradient, noiseTexture: noise };
  }, [isMobile]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: gradientTexture },
      uNoiseTexture: { value: noiseTexture },
      uTime: { value: 0 },
      uMouseStrength: { value: 0 },
      uScrollStrength: { value: 0 },
      uIntensity: { value: isMobile ? 0.35 : 0.55 },
      uOpacity: { value: 0 },
    }),
    [gradientTexture, noiseTexture, isMobile]
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    const frameInterval = isMobile ? 1 / 40 : 1 / 60;
    accumulator.current += delta;

    if (accumulator.current < frameInterval) return;

    const effectiveDelta = accumulator.current;
    accumulator.current = 0;

    material.uniforms.uTime.value += effectiveDelta;

    const velocityMagnitude = Math.sqrt(
      cursorVelocity.x * cursorVelocity.x + cursorVelocity.y * cursorVelocity.y
    );

    const targetMouseStrength = Math.min(velocityMagnitude * 0.04, 1.2);

    material.uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
      material.uniforms.uMouseStrength.value,
      targetMouseStrength,
      0.12
    );

    material.uniforms.uScrollStrength.value = THREE.MathUtils.lerp(
      material.uniforms.uScrollStrength.value,
      scrollProgress,
      0.08
    );

    material.uniforms.uOpacity.value = THREE.MathUtils.clamp(
      material.uniforms.uOpacity.value + effectiveDelta * 0.35,
      0,
      1
    );
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
      <shaderMaterial
        key={isMobile ? 'mobile' : 'desktop'}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

interface HeroCanvasProps {
  className?: string;
}

export default function HeroCanvas({ className = '' }: HeroCanvasProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasWebGLSupport] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    try {
      const canvas = document.createElement('canvas');
      const gl = (canvas.getContext('webgl2') ??
        canvas.getContext('webgl')) as WebGLRenderingContext | null;
      return Boolean(gl);
    } catch {
      return false;
    }
  });
  const updateCursor = useCursorStore(state => state.updatePosition);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = event => {
    updateCursor(event.clientX, event.clientY);
  };

  if (!hasWebGLSupport || prefersReducedMotion) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src="/hero-poster.svg"
            alt="Hero placeholder"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width: '100%', height: '100%' }}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 42 }}
        dpr={typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT ? 1 : 1.75}
        gl={{ alpha: true, antialias: false, stencil: false, depth: true }}
      >
        <color attach="background" args={['#05050f']} />
        <HeroPlane />
      </Canvas>
    </div>
  );
}
