import { motion } from 'framer-motion';

// Beautiful stylized TSANGA with individual letter paths
const LETTERS = [
  // T
  { d: 'M 0,0 L 40,0 M 20,0 L 20,55', ox: 0 },
  // S
  { d: 'M 38,0 Q 10,0 10,14 Q 10,28 24,28 Q 38,28 38,42 Q 38,55 10,55', ox: 50 },
  // A
  { d: 'M 5,55 L 24,0 L 43,55 M 10,35 L 38,35', ox: 100 },
  // N
  { d: 'M 5,55 L 5,0 L 38,55 L 38,0', ox: 155 },
  // G
  { d: 'M 38,18 Q 24,-5 5,10 Q -10,25 5,42 Q 18,58 38,48 L 38,32 L 22,32', ox: 208 },
  // A
  { d: 'M 5,55 L 24,0 L 43,55 M 10,35 L 38,35', ox: 258 },
];

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.18, type: 'spring', duration: 1.8, bounce: 0 },
      opacity: { delay: i * 0.18, duration: 0.3 },
    },
  }),
};

export default function TSANGALogo({ size = 1, animate = true }) {
  const w = 310 * size;
  const h = 70 * size;

  return (
    <motion.svg
      viewBox="0 0 310 70"
      width={w}
      height={h}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#c8dcff" />
          <stop offset="100%" stopColor="#4a8fff" />
        </linearGradient>
      </defs>

      {LETTERS.map((l, i) => (
        <motion.path
          key={i}
          d={l.d}
          transform={`translate(${l.ox + 5}, 7.5)`}
          stroke="url(#logoGrad)"
          strokeWidth={2.2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          variants={draw}
          custom={i}
        />
      ))}
    </motion.svg>
  );
}
