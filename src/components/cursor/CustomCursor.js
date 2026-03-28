import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });
  const dotX = useSpring(mx, { stiffness: 600, damping: 40 });
  const dotY = useSpring(my, { stiffness: 600, damping: 40 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Désactiver sur écrans tactiles (pointer: coarse) */
  const [isCoarse] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  );

  useEffect(() => {
    if (isCoarse) return;

    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    /* Délégation d'événements — plus robuste que listener par élément */
    const handleOver = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) setHovered(true);
    };
    const handleOut = (e) => {
      if (e.target.closest('a, button, [data-cursor]')) setHovered(false);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [mx, my, isCoarse, visible]);

  if (isCoarse) return null;

  return (
    <>
      {/* Ring — grossit au survol des liens et boutons */}
      <motion.div
        animate={{
          scale: hovered ? 1.65 : 1,
          borderColor: hovered ? 'rgba(74,143,255,1)' : 'rgba(74,143,255,0.7)',
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(74,143,255,0.7)',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'screen',
        }}
      />
      {/* Dot */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#4a8fff',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
    </>
  );
}
