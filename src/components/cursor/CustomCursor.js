import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 180, damping: 22 });
  const sy = useSpring(my, { stiffness: 180, damping: 22 });
  const dotX = useSpring(mx, { stiffness: 600, damping: 40 });
  const dotY = useSpring(my, { stiffness: 600, damping: 40 });
  const hoverRef = useRef(false);

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };

    const enterLink = () => { hoverRef.current = true; };
    const leaveLink = () => { hoverRef.current = false; };

    window.addEventListener('mousemove', move);
    const elements = Array.from(document.querySelectorAll('a, button, [data-cursor]'));
    elements.forEach((el) => {
      el.addEventListener('mouseenter', enterLink);
      el.addEventListener('mouseleave', leaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', enterLink);
        el.removeEventListener('mouseleave', leaveLink);
      });
    };
  }, [mx, my]);

  return (
    <>
      {/* Ring */}
      <motion.div
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
