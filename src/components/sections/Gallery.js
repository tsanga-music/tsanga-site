import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';
import { useInView } from 'framer-motion';

/* ── Swiper ────────────────────────────────────────────────────────── */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, A11y, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

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
  { id: 1,  src: img01,    label: 'TSANGA 1' },
  { id: 2,  src: img02,    label: 'TSANGA 2' },
  { id: 3,  src: img03,    label: 'TSANGA 3' },
  { id: 4,  src: img04,    label: 'TSANGA 4' },
  { id: 5,  src: img05,    label: 'TSANGA 5' },
  { id: 6,  src: img06,    label: 'TSANGA 6' },
  { id: 7,  src: img07,    label: 'TSANGA 7' },
  { id: 8,  src: img09,    label: 'TSANGA 9' },
  { id: 9,  src: img10,    label: 'TSANGA 10' },
  { id: 10, src: img11,    label: 'TSANGA 11' },
  { id: 11, src: img12,    label: 'TSANGA 12' },
  { id: 12, src: imgCover, label: 'Cover' },
];

/* ── Variants lightbox ───────────────────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 110 : -110, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -110 : 110, opacity: 0 }),
};

/* ── Lightbox plein écran avec zoom ×2 ──────────────────────────── */
function Lightbox({ photos, index, direction, onClose, onPrev, onNext }) {
  const [zoomed, setZoomed] = useState(false);

  /* Reset zoom au changement de photo */
  useEffect(() => { setZoomed(false); }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && index > 0)                 onPrev();
      if (e.key === 'ArrowRight' && index < photos.length - 1) onNext();
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
        background: 'rgba(0,0,0,0.95)',
        backdropFilter: 'blur(14px)',
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

      {/* Bouton zoom */}
      <button
        onClick={(e) => { e.stopPropagation(); setZoomed(z => !z); }}
        style={{
          position: 'fixed', top: '1.5rem', right: '5rem',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 3,
          color: zoomed ? '#4a8fff' : 'rgba(255,255,255,0.55)',
          cursor: 'none', padding: '0.4rem 0.8rem',
          fontSize: '0.8rem', letterSpacing: '0.08em',
          zIndex: 2001,
          transition: 'color 0.2s, border-color 0.2s',
        }}
      >
        {zoomed ? '×1' : '×2'}
      </button>

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

      {/* Image container avec zoom scrollable */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: zoomed ? '100vw' : '88vw',
          maxHeight: zoomed ? '100vh' : '86vh',
          overflow: zoomed ? 'scroll' : 'visible',
          borderRadius: zoomed ? 0 : 2,
          transition: 'max-width 0.3s, max-height 0.3s',
        }}
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
              width: zoomed ? '200%' : '100%',
              maxHeight: zoomed ? 'none' : '86vh',
              objectFit: 'contain',
              display: 'block',
              transition: 'width 0.3s ease, max-height 0.3s ease',
            }}
          />
        </AnimatePresence>

        {/* Compteur */}
        <div style={{
          position: 'fixed',
          bottom: '1.5rem', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.1em', whiteSpace: 'nowrap',
          background: 'rgba(4,4,10,0.6)',
          padding: '0.3rem 0.8rem', borderRadius: 2,
          zIndex: 2002,
        }}>
          {index + 1} / {photos.length}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Gallery section ──────────────────────────────────────────────── */
export default function Gallery() {
  const { t } = useLang();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: false, amount: 0.3 });
  const glow = useSectionGlow();

  const [lb, setLb] = useState({ open: false, index: 0, dir: 0 });

  const openLb  = useCallback((i) => setLb({ open: true,  index: i,             dir: 0 }),  []);
  const closeLb = useCallback(()  => setLb((s) => ({ ...s, open: false })),                   []);
  const prevLb  = useCallback(()  => setLb((s) => ({ ...s, index: s.index - 1, dir: -1 })), []);
  const nextLb  = useCallback(()  => setLb((s) => ({ ...s, index: s.index + 1, dir:  1 })), []);

  return (
    <section id="gallery" className="section-pad" style={{ position: 'relative' }}>
      {/* Section title */}
      <div ref={titleRef} style={{ marginBottom: '3rem' }}>
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

      {/* ── Swiper coverflow ──────────────────────────────────────── */}
      <style>{`
        .tsanga-swiper { width: 100%; padding: 2rem 0 3.5rem !important; }
        .tsanga-swiper .swiper-slide {
          width: clamp(260px, 40vw, 480px);
          height: clamp(300px, 50vw, 560px);
          border-radius: 3px;
          overflow: hidden;
          cursor: none;
          opacity: 0.4;
          transition: opacity 0.4s;
        }
        .tsanga-swiper .swiper-slide-active { opacity: 1; }
        .tsanga-swiper .swiper-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .tsanga-swiper .swiper-button-prev,
        .tsanga-swiper .swiper-button-next {
          color: rgba(255,255,255,0.45) !important;
          cursor: none !important;
        }
        .tsanga-swiper .swiper-button-prev:hover,
        .tsanga-swiper .swiper-button-next:hover {
          color: #4a8fff !important;
        }
        .tsanga-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.25) !important;
          opacity: 1 !important;
          cursor: none !important;
        }
        .tsanga-swiper .swiper-pagination-bullet-active {
          background: #4a8fff !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .tsanga-swiper * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <Swiper
        className="tsanga-swiper"
        modules={[Navigation, Pagination, EffectCoverflow, A11y, Mousewheel]}
        effect="coverflow"
        grabCursor={false}
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 28,
          stretch: 0,
          depth: 160,
          modifier: 1,
          slideShadows: true,
        }}
        navigation
        pagination={{ clickable: true }}
        mousewheel={{ forceToAxis: true, releaseOnEdges: true }}
        onSlideClick={(swiper) => openLb(swiper.realIndex)}
      >
        {PHOTOS.map((photo, i) => (
          <SwiperSlide key={photo.id}>
            <img src={photo.src} alt={photo.label} draggable={false} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hint double-tap */}
      <p style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.2)',
        marginBottom: '3rem',
      }}>
        cliquer pour plein écran · ×2 pour zoomer
      </p>

      {/* Credits */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        style={{
          marginTop: '1rem',
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
