import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';
import { AudioProvider } from './context/AudioContext';
import { motion } from 'framer-motion';
import MistCanvas from './components/canvas/MistCanvas';
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

/* ── Transition d'entrée pour chaque section ──────────────────────────
   Slide-up dramatique + fade au scroll. once:true = ne rejoue pas.
─────────────────────────────────────────────────────────────────────── */
function SectionReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 1.15, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <AudioProvider>
          {/* Fixed layers */}
          <MistCanvas />
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
