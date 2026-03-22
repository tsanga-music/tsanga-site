import { motion } from 'framer-motion';
import LogoReveal from '../ui/LogoReveal';
import { useLang } from '../../context/LangContext';
import { useAudio } from '../../context/AudioContext';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const { t } = useLang();
  const { toggle } = useAudio();
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
        {/* Logo — PNG reveal with glow + glitch */}
        <LogoReveal />

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
        >
          <div style={{
            width: 40,
            height: 1,
            background: 'rgba(74,143,255,0.5)',
            marginBottom: '0.4rem',
          }} />
          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 300,
          }}>
            {t.hero.tagline}
          </p>
          <p style={{
            fontSize: '1.2rem',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {t.hero.sub}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', gap: '1.2rem', marginTop: '0.5rem' }}
        >
          <motion.button
            onClick={toggle}
            whileHover={{ background: 'rgba(74,143,255,0.2)', borderColor: '#4a8fff' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '1px solid rgba(74,143,255,0.5)',
              borderRadius: 2,
              color: '#fff',
              fontSize: '1rem',
              letterSpacing: '0.04em',
              cursor: 'none',
              fontFamily: 'inherit',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            {t.hero.cta}
          </motion.button>

          <motion.button
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ background: 'rgba(255,255,255,0.05)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '1rem 2.5rem',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 2,
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1rem',
              letterSpacing: '0.04em',
              cursor: 'none',
              fontFamily: 'inherit',
              transition: 'background 0.3s',
            }}
          >
            {t.hero.scroll}
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'rgba(255,255,255,0.25)',
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>

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
