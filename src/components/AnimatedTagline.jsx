import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  'Architecte du vide sonore',
  'Electro Darkwave · Bruxelles',
  'DJ · Producteur · Performer',
  'A Celebration of the Night · the Unseen · the Unheard',
];

export default function AnimatedTagline({ style }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % phrases.length);
    }, 3000);
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '100%',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {phrases[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
