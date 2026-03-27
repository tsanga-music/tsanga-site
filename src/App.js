import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';
import { AudioProvider } from './context/AudioContext';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import WaterBackground from './components/WaterBackground';
import CustomCursor from './components/cursor/CustomCursor';
import Navbar from './components/layout/Navbar';
import AudioPlayer from './components/layout/AudioPlayer';
import CartDrawer from './components/ui/CartDrawer';
import ScrollToTop from './components/ui/ScrollToTop';
import Hero from './components/sections/Hero';
import Gallery from './components/sections/Gallery';
import Music from './components/sections/Music';
import Shop from './components/sections/Shop';
import Lives from './components/sections/Lives';
import Contact from './components/sections/Contact';

/* ── Transition d'entrée pour chaque section via GSAP ScrollTrigger ──
   Chaque section glisse depuis y:70 → 0 avec fade. once (reverse: false).
─────────────────────────────────────────────────────────────────────── */
function SectionReveal({ children, delay = 0 }) {
  const ref = useScrollAnimation({ y: 70, duration: 1.15, delay, ease: 'power3.out' });
  return <div ref={ref}>{children}</div>;
}

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <AudioProvider>
          {/* Fixed layers */}
          <WaterBackground />
          <CustomCursor />

          {/* Main layout */}
          <div style={{ position: 'relative', zIndex: 1, paddingBottom: 80 }}>
            <Navbar />
            <main>
              <Hero />
              <SectionReveal><Gallery /></SectionReveal>
              <SectionReveal delay={0.05}><Music /></SectionReveal>
              <SectionReveal delay={0.05}><Shop /></SectionReveal>
              <SectionReveal delay={0.05}><Lives /></SectionReveal>
              <SectionReveal delay={0.05}><Contact /></SectionReveal>
            </main>
          </div>

          {/* Fixed UI */}
          <AudioPlayer />
          <CartDrawer />
          <ScrollToTop />
        </AudioProvider>
      </CartProvider>
    </LangProvider>
  );
}
