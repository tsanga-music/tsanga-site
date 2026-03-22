import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollToTop() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      // Apparaît dès le premier pixel, atteint 1 à 90% de la page
      const p = total > 0 ? Math.min(1, scrolled / (total * 0.9)) : 0;
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      whileHover={{ borderColor: 'rgba(74,143,255,0.7)' }}
      whileTap={{ scale: 0.88 }}
      style={{
        position: 'fixed',
        bottom: '6.5rem',
        right: '2rem',
        zIndex: 750,
        width: 56,
        height: 56,
        background: 'rgba(4,4,14,0.75)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '50%',
        cursor: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.6rem',
        color: '#ffffff',
        backdropFilter: 'blur(12px)',
        opacity: progress,
        transform: `translateY(${(1 - progress) * 32}px)`,
        transition: 'opacity 2.2s ease-in-out, transform 2.6s ease-in-out',
        pointerEvents: progress > 0.04 ? 'auto' : 'none',
      }}
    >
      ↑
    </motion.button>
  );
}
