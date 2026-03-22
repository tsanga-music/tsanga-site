import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useCart } from '../../context/CartContext';
import { Plus, Check } from 'lucide-react';
import { useSectionGlow } from '../../hooks/useSectionGlow';

const ICONS = {
  Vinyl: '💿', Apparel: '👕', Bekleidung: '👕',
  Accessoire: '🎖️', Accessory: '🎖️', Zubehör: '🎖️',
  Cassette: '📼', Kassette: '📼',
  Print: '🖼️', Druck: '🖼️',
  Bundle: '📦',
};

function ShopItem({ item, index, onAdd }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35 }}
        style={{
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          position: 'relative',
          cursor: 'none',
        }}
      >
        {/* Product image area */}
        <div style={{
          aspectRatio: '1/1',
          background: 'rgba(74,143,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative background */}
          <svg viewBox="0 0 300 300" width="100%" height="100%"
            style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <radialGradient id={`sg${item.id}`} cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#4a8fff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#04040a" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="300" height="300" fill="#04040a" />
            <circle cx="150" cy="150" r="150" fill={`url(#sg${item.id})`} />
            <rect x="50" y="50" width="200" height="200" fill="none"
              stroke="rgba(74,143,255,0.08)" strokeWidth="1" />
            <line x1="50" y1="150" x2="250" y2="150"
              stroke="rgba(74,143,255,0.05)" strokeWidth="0.5" />
            <line x1="150" y1="50" x2="150" y2="250"
              stroke="rgba(74,143,255,0.05)" strokeWidth="0.5" />
          </svg>

          {/* Emoji icon */}
          <span style={{ fontSize: '3.5rem', position: 'relative', zIndex: 1, filter: 'saturate(0.7)' }}>
            {ICONS[item.type] || '📦'}
          </span>
        </div>

        {/* Info */}
        <div style={{ padding: '1rem 1.2rem' }}>
          <div style={{ marginBottom: '0.3rem' }}>
            <span style={{
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.04em'
            }}>
              {item.type}
            </span>
          </div>
          <div style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '0.8rem',
            color: '#fff',
            letterSpacing: '0.04em',
          }}>
            {item.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              {item.price} €
            </span>
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.93 }}
              animate={{ background: added ? '#1a4a2a' : 'rgba(255,255,255,0.06)' }}
              style={{
                border: added ? '1px solid rgba(60,220,100,0.4)' : '1px solid rgba(255,255,255,0.2)',
                borderRadius: 3,
                padding: '6px 12px',
                cursor: 'none',
                color: added ? '#3adc64' : 'rgba(255,255,255,0.7)',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'border-color 0.3s, color 0.3s',
              }}
            >
              {added ? <Check size={13} /> : <Plus size={13} />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Shop() {
  const { t } = useLang();
  const { add } = useCart();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();

  const handleAdd = (item) => {
    add(item);
  };

  return (
    <section id="shop" style={{
      padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)',
      position: 'relative',
    }}>
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
          initial={{ scaleX: 0 }}
          animate={titleInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          style={{ width: 48, height: 1, background: '#4a8fff', marginBottom: '1.2rem', transformOrigin: 'left' }}
        />
        <motion.h2
          ref={glow.ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: titleInView ? 1 : 0,
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
            opacity: { duration: 0.8, delay: 0.15 },
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

      {/* Items grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.5rem',
      }}>
        {t.shop.items.map((item, i) => (
          <ShopItem key={item.id} item={item} index={i} onAdd={handleAdd} />
        ))}
      </div>
    </section>
  );
}
