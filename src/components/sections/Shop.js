import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';

export default function Shop() {
  const { t } = useLang();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: false, amount: 0.3 });
  const glow = useSectionGlow();

  return (
    <section id="shop" className="section-pad" style={{ position: 'relative' }}>
      {/* Background accent */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '40%',
        height: '60%',
        background: 'radial-gradient(ellipse, rgba(74,143,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Section title */}
      <div ref={titleRef} style={{ marginBottom: '4rem' }}>
        <motion.div
          initial={{ scaleX: 50 }}
          animate={titleInView ? { scaleX: 1 } : { scaleX: 50 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          style={{ width: 48, height: 1, background: '#4a8fff', marginBottom: '1.2rem', transformOrigin: 'left' }}
        />
        <motion.h2
          ref={glow.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: titleInView
              ? [0, 0.85, 0.05, 0.92, 0.08, 1, 0.3, 1, 0.6, 1, 0.9, 1]
              : 0,
            y: titleInView ? 0 : 20,
            filter: glow.glowing
              ? [
                  'drop-shadow(0 0 10px rgba(74,143,255,0.95)) drop-shadow(0 0 28px rgba(74,143,255,0.5))',
                  'drop-shadow(0 0 10px rgba(255,40,90,0.95)) drop-shadow(0 0 28px rgba(255,40,90,0.5))',
                  'drop-shadow(0 0 10px rgba(74,143,255,0.95)) drop-shadow(0 0 28px rgba(74,143,255,0.5))',
                ]
              : 'drop-shadow(0 0 0px rgba(0,0,0,0))',
          }}
          transition={{
            opacity: titleInView
              ? { duration: 3.5, delay: 0.2, times: [0, 0.06, 0.11, 0.17, 0.24, 0.32, 0.39, 0.46, 0.54, 0.61, 0.78, 1] }
              : { duration: 0.4 },
            y: { duration: 0.8, delay: 0.15 },
            filter: glow.glowing
              ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 1.2, ease: 'easeOut' },
          }}
          onMouseEnter={glow.onMouseEnter}
          onMouseLeave={glow.onMouseLeave}
          style={{
            fontSize: 'clamp(4rem, 10vw, 9rem)',
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: '#fff',
            margin: 0,
            lineHeight: 0.9,
          }}
        >
          {t.shop.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}
        >
          {t.shop.subtitle}
        </motion.p>
      </div>

      {/* Coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          padding: '4rem 2rem',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 32,
          height: 1,
          background: 'rgba(74,143,255,0.4)',
          marginBottom: '0.4rem',
        }} />
        <p style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
          fontWeight: 300,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.7)',
          margin: 0,
        }}>
          {t.shop.comingSoon}
        </p>
        <p style={{
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.25)',
          margin: 0,
        }}>
          Coming soon
        </p>
      </motion.div>
    </section>
  );
}
