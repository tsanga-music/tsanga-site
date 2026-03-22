import { LangProvider } from './context/LangContext';
import { CartProvider } from './context/CartContext';
import { AudioProvider } from './context/AudioContext';
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
              <Gallery />
              <Music />
              <Shop />
              <Lives />
              <Contact />
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
