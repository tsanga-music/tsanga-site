import { motion } from 'framer-motion';

export default function AnimatedButton({ children, onClick, style }) {
  return (
    <motion.button
      onClick={onClick}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      whileHover={{
        y: -2,
        boxShadow: '0 0 22px rgba(120, 100, 255, 0.45), 0 0 6px rgba(74,143,255,0.6)',
        borderColor: '#4a8fff',
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.96,
        transition: { duration: 0.1 },
      }}
      style={{
        cursor: 'none',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
