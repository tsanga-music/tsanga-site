import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';

import img01 from '../../assets/TSANGA 1 exp.jpg';
import img02 from '../../assets/TSANGA 2 exp.jpg';
import img03 from '../../assets/TSANGA 3 exp.jpg';
import img04 from '../../assets/TSANGA 4 exp.jpg';
import img05 from '../../assets/TSANGA 5  exp.jpg';
import img06 from '../../assets/TSANGA 6 exp.jpg';
import img07 from '../../assets/TSANGA 7 exp.jpg';
import img09 from '../../assets/tsanga 9 exp.jpg';
import img10 from '../../assets/TSANGA 10  exp.jpg';
import img11 from '../../assets/TSANGA 11 exp.jpg';
import img12 from '../../assets/TSANGA 12 exp.jpg';
import imgCover from '../../assets/TSANGA cover (full) .jpg';

const PHOTOS = [
  { id: 1,  src: img01,    label: 'TSANGA 1',  span: 'span 2' },
  { id: 2,  src: img02,    label: 'TSANGA 2',  span: 'span 1' },
  { id: 3,  src: img03,    label: 'TSANGA 3',  span: 'span 1' },
  { id: 4,  src: img04,    label: 'TSANGA 4',  span: 'span 2' },
  { id: 5,  src: img05,    label: 'TSANGA 5',  span: 'span 1' },
  { id: 6,  src: img06,    label: 'TSANGA 6',  span: 'span 2' },
  { id: 7,  src: img07,    label: 'TSANGA 7',  span: 'span 2' },
  { id: 8,  src: img09,    label: 'TSANGA 9',  span: 'span 1' },
  { id: 9,  src: img10,    label: 'TSANGA 10', span: 'span 1' },
  { id: 10, src: img11,    label: 'TSANGA 11', span: 'span 2' },
  { id: 11, src: img12,    label: 'TSANGA 12', span: 'span 1' },
  { id: 12, src: imgCover, label: 'Cover',     span: 'span 2' },
];

const CIRCLE = 160; // diamètre de la loupe en px
const RADIUS = CIRCLE / 2;

/* ── Variants lightbox : glissement gauche/droite ─────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 110 : -110, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -110 : 110, opacity: 0 }),
};

/* ── Lightbox ─────────────────────────────────────────────────────── */
function Lightbox({ photos, index, direction, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && index > 0)                  onPrev();
      if (e.key === 'ArrowRight' && index < photos.length - 1)  onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, onPrev, onNext, photos.length]);

  const btnBase = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 3,
    color: '#fff',
    fontSize: '1.3rem',
    cursor: 'none',
    padding: '0.75rem 1.1rem',
    zIndex: 2001,
    transition: 'background 0.2s',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.93)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'none',
      }}
    >
      {/* Fermer */}
      <button onClick={onClose} style={{
        position: 'fixed', top: '1.5rem', right: '2rem',
        background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.55)', fontSize: '2rem',
        cursor: 'none', lineHeight: 1, padding: '0.2rem 0.5rem',
        zIndex: 2001,
      }}>✕</button>

      {/* Précédent */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{ position: 'fixed', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', ...btnBase }}
        >←</button>
      )}

      {/* Suivant */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{ position: 'fixed', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', ...btnBase }}
        >→</button>
      )}

      {/* Image avec transition */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            src={photos[index].src}
            alt={photos[index].label}
            style={{
              maxWidth: '88vw',
              maxHeight: '86vh',
              objectFit: 'contain',
              borderRadius: 2,
              display: 'block',
            }}
          />
        </AnimatePresence>

        {/* Compteur */}
        <div style={{
          position: 'absolute', bottom: '-2.2rem', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', whiteSpace: 'nowrap',
        }}>
          {index + 1} / {photos.length}
        </div>
      </div>
    </motion.div>
  );
}

/* ── GalleryItem ──────────────────────────────────────────────────── */
function GalleryItem({ photo, index, onOpen }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const containerRef = useRef(null);
  const clickTimerRef = useRef(null);
  const clickCountRef = useRef(0);

  /* zoomActive : activé par double-clic, désactivé par simple clic ou mouseleave */
  const [zoomActive, setZoomActive] = useState(false);
  const [mag, setMag] = useState({
    visible: false, x: 0, y: 0,
    bgPosX: 0, bgPosY: 0, bgW: 0, bgH: 0,
  });

  /* Distingue simple clic (lightbox) vs double-clic (zoom) */
  const handleClick = useCallback(() => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);

    clickTimerRef.current = setTimeout(() => {
      const n = clickCountRef.current;
      clickCountRef.current = 0;
      clickTimerRef.current = null;

      if (n >= 2) {
        /* Double-clic → toggle zoom */
        setZoomActive((v) => !v);
        setMag((m) => ({ ...m, visible: false }));
      } else {
        /* Simple clic → si zoom actif on le coupe, sinon on ouvre la lightbox */
        if (zoomActive) {
          setZoomActive(false);
          setMag((m) => ({ ...m, visible: false }));
        } else {
          onOpen();
        }
      }
    }, 260);
  }, [onOpen, zoomActive]);

  /* Loupe — n'affiche que si zoomActive */
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !zoomActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMag({
      visible: true,
      x, y,
      bgPosX: RADIUS - x * 2,
      bgPosY: RADIUS - y * 2,
      bgW: rect.width * 2,
      bgH: rect.height * 2,
    });
  }, [zoomActive]);

  const handleMouseLeave = useCallback(() => {
    setMag((m) => ({ ...m, visible: false }));
    /* Désactive le zoom quand la souris quitte la photo */
    setZoomActive(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 2, height: '100%' }}
    >
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative', width: '100%', height: '100%',
          overflow: 'hidden', cursor: 'none',
        }}
      >
        <motion.img
          src={photo.src}
          alt={photo.label}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: 'block',
          }}
        />

        {/* Indicateur zoom actif */}
        {zoomActive && (
          <div style={{
            position: 'absolute', bottom: 8, right: 10,
            fontSize: '0.6rem', letterSpacing: '0.08em',
            color: 'rgba(74,143,255,0.9)',
            background: 'rgba(4,4,10,0.7)',
            padding: '2px 6px', borderRadius: 2,
            pointerEvents: 'none', zIndex: 11,
          }}>
            ZOOM
          </div>
        )}

        {/* Loupe circulaire — visible uniquement si zoomActive */}
        {mag.visible && zoomActive && (
          <div style={{
            position: 'absolute',
            left: mag.x - RADIUS,
            top:  mag.y - RADIUS,
            width: CIRCLE,
            height: CIRCLE,
            borderRadius: '50%',
            backgroundImage: `url(${photo.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${mag.bgW}px ${mag.bgH}px`,
            backgroundPosition: `${mag.bgPosX}px ${mag.bgPosY}px`,
            border: '2px solid rgba(255,255,255,0.55)',
            boxShadow: '0 0 0 1px rgba(74,143,255,0.45), 0 6px 24px rgba(0,0,0,0.7)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />
        )}
      </div>
    </motion.div>
  );
}

/* ── Gallery section ──────────────────────────────────────────────── */
export default function Gallery() {
  const { t } = useLang();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();

  const [lb, setLb] = useState({ open: false, index: 0, dir: 0 });

  const openLb  = useCallback((i) => setLb({ open: true,  index: i,             dir: 0 }),  []);
  const closeLb = useCallback(()  => setLb((s) => ({ ...s, open: false })),                   []);
  const prevLb  = useCallback(()  => setLb((s) => ({ ...s, index: s.index - 1, dir: -1 })), []);
  const nextLb  = useCallback(()  => setLb((s) => ({ ...s, index: s.index + 1, dir:  1 })), []);

  return (
    <section id="gallery" className="section-pad" style={{ position: 'relative' }}>
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
          {t.gallery.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '0.6rem',
          }}
        >
          {t.gallery.subtitle}
        </motion.p>
      </div>

      {/* Grille */}
      <div className="gallery-grid">
        {PHOTOS.map((photo, i) => (
          <div key={photo.id} style={{ gridRow: photo.span }}>
            <GalleryItem photo={photo} index={i} onOpen={() => openLb(i)} />
          </div>
        ))}
      </div>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p style={{
          fontSize: '0.6rem',
          letterSpacing: '0.08em',
          color: 'rgba(212,216,240,0.3)',
          marginBottom: '0.8rem',
        }}>
          Credits and thanks to :
        </p>
        <div className="gallery-credits">
          {[
            { handle: 'laetishirt',          role: 'Creative Director' },
            { handle: 'rhyspll',             role: 'Photographer' },
            { handle: 'emotionalriots',      role: 'Studio and Light Assistant' },
            { handle: 'sbizien',             role: 'Hairstylist' },
            { handle: 'kipras_mash',         role: 'Hairstylist Assistant' },
            { handle: 'lucianprietosanchez', role: 'Stylist' },
            { handle: 'alv_mua',             role: 'Make Up Artist' },
            { handle: 'afrobodega',          role: 'Brand' },
            { handle: 'sangiev',             role: 'Brand' },
          ].map(({ handle, role }) => (
            <span key={handle} style={{ fontSize: '0.65rem', color: 'rgba(212,216,240,0.35)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
              <a
                href={`https://instagram.com/${handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'rgba(212,216,240,0.55)',
                  textDecoration: 'none',
                  cursor: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,216,240,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,216,240,0.55)'}
              >
                @{handle}
              </a>
              {' '}· {role}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lb.open && (
          <Lightbox
            photos={PHOTOS}
            index={lb.index}
            direction={lb.dir}
            onClose={closeLb}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
