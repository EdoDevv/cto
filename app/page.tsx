import Hero from '@/components/ui/Hero';
import Section from '@/components/ui/Section';

export default function Home() {
  return (
    <>
      <Hero />

      <Section
        index={1}
        title="Crafted to Perfection"
        description="Every pixel serves a purpose. Every motion tells a story. Experience the intersection of art and technology with stunning visuals that push the boundaries of the web."
      />

      <Section
        index={2}
        title="Performance First"
        description="Built with cutting-edge optimizations, progressive enhancement, and mobile-first principles. Delivering smooth 60fps animations while respecting user preferences and system capabilities."
      />

      <Section
        index={3}
        title="Accessibility Matters"
        description="Motion respects your preferences. Full support for reduced motion settings, keyboard navigation, and semantic HTML to ensure everyone can experience the web beautifully."
      />
    </>
  );
}
