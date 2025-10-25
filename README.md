# Lusion-inspired Hero Animation

A modern web stack featuring a flagship hero animation inspired by [lusion.co](https://lusion.co), built with Next.js 14, React Three Fiber, and GSAP.

## 🚀 Features

- **Immersive WebGL hero** with custom GLSL shaders
- **Smooth scroll** powered by Lenis
- **GSAP ScrollTrigger** timelines for parallax effects
- **Cursor microinteractions** responding to velocity
- **Progressive enhancement** with reduced-motion support
- **Mobile-optimized** with lighter shaders and capped frame rates
- **TypeScript** for type safety
- **ESLint + Prettier** with pre-commit hooks
- **GitHub Actions CI** for automated testing

## 📦 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Runtime:** Node 20 LTS
- **Package Manager:** PNPM
- **3D Rendering:** Three.js, @react-three/fiber, @react-three/drei
- **Animation:** GSAP + ScrollTrigger
- **Smooth Scroll:** Lenis
- **State Management:** Zustand
- **Tooling:** TypeScript, ESLint, Prettier, Husky, lint-staged

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- PNPM 8.15+

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint code
pnpm format       # Format code with Prettier
pnpm format:check # Check code formatting
```

## 🎨 Customization

### Tweaking Shader Parameters

Shader uniforms can be adjusted in `/components/canvas/HeroCanvas.tsx`:

```typescript
const uniforms = useMemo(
  () => ({
    uIntensity: { value: 0.55 }, // Displacement intensity
    uMouseStrength: { value: 0 }, // Cursor velocity effect
    uScrollStrength: { value: 0 }, // Scroll-driven distortion
    // ...
  }),
  []
);
```

### Customizing ScrollTrigger Timeline

Modify the GSAP timeline in `/components/ui/Hero.tsx`:

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef.current,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
  },
});

tl.to(titleRef.current, {
  y: -100,
  opacity: 0,
  ease: 'power2.in',
});
```

### Shader Files

- **Vertex:** `/shaders/hero.vert`
- **Fragment:** `/shaders/hero.frag`

Edit these to create custom visual effects. The fragment shader includes:

- Noise-based displacement
- Cursor velocity response
- Scroll-driven effects
- Vignette
- Film grain
- Tone mapping

## 📱 Progressive Enhancement

### Reduced Motion

Users with `prefers-reduced-motion: reduce` see a static gradient fallback instead of animated effects.

### WebGL Detection

If WebGL is unavailable, the app renders a static fallback image.

### Mobile Optimizations

- Lower resolution textures
- Reduced geometry detail
- Frame rate capping to ~40fps
- Lighter shader calculations

## 🏗️ Project Structure

```
.
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout with Lenis
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── canvas/
│   │   └── HeroCanvas.tsx   # WebGL canvas component
│   └── ui/
│       ├── Hero.tsx         # Hero section with GSAP
│       ├── Section.tsx      # Placeholder sections
│       └── SmoothScroller.tsx
├── hooks/
│   ├── useLenis.ts          # Smooth scroll hook
│   └── usePrefersReducedMotion.ts
├── lib/
│   ├── gsap.ts              # GSAP config
│   └── store.ts             # Zustand stores
├── shaders/
│   ├── hero.vert            # Vertex shader
│   └── hero.frag            # Fragment shader
└── public/
    ├── hero-poster.svg      # Fallback image
    └── textures/
        └── noise.svg        # Noise texture
```

## 🧪 Testing

```bash
# Lint
pnpm lint

# Build
pnpm build
```

## 🚢 Deployment

The project is production-ready and can be deployed to Vercel, Netlify, or any Node.js hosting:

```bash
pnpm build
pnpm start
```

## ♿ Accessibility

- Semantic HTML with proper heading hierarchy
- Keyboard navigation support
- Respects `prefers-reduced-motion`
- Focus states for interactive elements
- Alt text for images

## 🎯 Performance

- Target: ~60fps on modern desktop (1080p)
- Mobile: ~40fps with optimized shaders
- No layout shift
- Lazy-loaded WebGL canvas
- Throttled render loop on scroll

## 📄 License

MIT

## 🙏 Acknowledgments

Inspired by the incredible work at [Lusion](https://lusion.co). This is an original implementation delivering similar perceived quality, not a replica of their code or assets.
