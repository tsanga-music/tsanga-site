import { motion } from 'framer-motion';
import LogoReveal from '../ui/LogoReveal';
import AnimatedButton from '../AnimatedButton';
import AnimatedTagline from '../AnimatedTagline';
import { useLang } from '../../context/LangContext';
import { useAudio } from '../../context/AudioContext';

export default function Hero() {
  const { t } = useLang();
  const { playFirst } = useAudio();

  const handleListen = () => {
    document.getElementById('music')?.scrollIntoView({ behavior: 'smooth' });
    /* Lance le Live Set SC après que le scroll soit terminé */
    setTimeout(() => playFirst(), 900);
  };
  return (
    <section id="hero" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '0 2rem',
      overflow: 'hidden',
    }}>
      {/* Vertical accent lines */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          left: '8vw',
          top: '15%',
          bottom: '15%',
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(74,143,255,0.4), transparent)',
          transformOrigin: 'top',
        }}
      />
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          right: '8vw',
          top: '15%',
          bottom: '15%',
          width: 1,
          background: 'linear-gradient(180deg, transparent, rgba(74,143,255,0.4), transparent)',
          transformOrigin: 'top',
        }}
      />

      {/* Horizontal decorative line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '8vw',
          right: '8vw',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(74,143,255,0.15), transparent)',
          transformOrigin: 'center',
        }}
      />

      {/* Main content */}
      <div style={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        {/* Logo — PNG reveal with glow + glitch + 3D tilt */}
        <LogoReveal />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}
        >
          <div style={{
            width: 40,
            height: 1,
            background: 'rgba(74,143,255,0.5)',
            marginBottom: '0.2rem',
          }} />

          {/* Tagline animée */}
          <AnimatedTagline style={{
            fontSize: 'clamp(1.1rem, 3.2vw, 1.6rem)',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.78)',
            fontWeight: 400,
            fontStyle: 'italic',
          }} />

          {/* Location indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="hero-status-dot" />
            <p style={{
              fontSize: '0.8rem',
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.32)',
              fontWeight: 400,
              fontStyle: 'normal',
            }}>
              {t.hero.sub}
            </p>
          </div>
        </motion.div>

        {/* CTA — bouton Écouter uniquement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: '0.5rem' }}
        >
          <AnimatedButton
            onClick={handleListen}
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '1px solid rgba(74,143,255,0.5)',
              borderRadius: 2,
              color: '#fff',
              fontSize: '1rem',
              letterSpacing: '0.04em',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            {t.hero.cta}
          </AnimatedButton>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        background: 'linear-gradient(to bottom, transparent, #04040a)',
        pointerEvents: 'none',
      }} />
    </section>
  );
}
