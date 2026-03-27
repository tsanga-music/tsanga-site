import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  'Architecte du vide sonore',
  'Electro Dark Wave · Bruxelles',
  'DJ · Producteur · Multi-instrumentiste',
  'Guitare · Basse · Violon · Batterie · Voix',
  'Inspiré par Joy Division, John Maus, Frank De Wulf',
  '« Une balade nocturne en ville, les lumières qui défilent »',
  'CSC Records · A Piece of Sky — Avril 2025',
  'A Celebration of the Night · the Unseen · the Unheard',
];

export default function AnimatedTagline({ style }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % phrases.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: 'relative',
      height: '2em',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            margin: 0,
            fontStyle: index === 5 ? 'italic' : 'normal',
          }}
        >
          {phrases[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
