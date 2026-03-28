import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';
import { useAudio } from '../../context/AudioContext';
import frontSrc from '../../assets/pochette front.JPG';
import backSrc  from '../../assets/pochette back.JPG';

/* ── Constructeur d'URL SoundCloud ────────────────────────────────── */
const SC_PARAMS = '&color=%23d4d8f0&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false';

function scUrl(path, visual = false) {
  const tokenMatch = path.match(/\/s-([A-Za-z0-9]+)$/);
  const cleanPath  = tokenMatch ? path.slice(0, path.lastIndexOf('/s-')) : path;
  const tokenParam = tokenMatch ? `&secret_token=s-${tokenMatch[1]}` : '';
  return `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/tsanga-berlin/${cleanPath}${tokenParam}${SC_PARAMS}&visual=${visual}`;
}

/* ── Données ──────────────────────────────────────────────────────── */
const LIVE_SET = { path: '20260321-live-set-2026-tsanga/s-tuo0lMPjbNw', label: 'Live Set 2026' };
const EP       = { path: 'sets/a-piece-of-sky-final',                    label: 'EP — A Piece Of Sky' };

const EXCLUSIVES = [
  { path: '20260318-virus/s-oQHhq2CjlBM',              label: 'Virus' },
  { path: '20260320-back-and-i-feel-the/s-i9fW3MpEDiT', label: 'Back And I Feel The' },
];

const SINGLES = [
  { path: 'my-way-through',                 label: 'My Way Through' },
  { path: 'tsanga-none-of-this-shit-2',     label: 'None Of This Shit' },
  { path: 'tsanga-reason-mst-final2-1',     label: 'Reason' },
  { path: 'tsanga-voidy-inside-mst-1',      label: 'Voidy Inside' },
  { path: 'tsanga-pink-truck-mst-final2-1', label: 'Pink Truck' },
  { path: 'tsanga-lost-my-way-mst-1',       label: 'Lost My Way' },
  { path: 'tsanga-darker-days-mst-1',       label: 'Darker Days' },
  { path: 'tsanga-voidy-inside-jean-1',     label: 'Voidy Inside (Jean remix)' },
];

/* ── Label de section ─────────────────────────────────────────────── */
function SectionLabel({ children, mt = false }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4 }}
      style={{
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.3)',
        marginTop: mt ? '3rem' : 0,
        marginBottom: '1rem',
      }}
    >
      {children}
    </motion.p>
  );
}

/* ── Pochette vinyle flip recto/verso ─────────────────────────────── */
function VinylFlip() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}
    >
      {/* Wrapper — établit le contexte de perspective */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(300px, 40vw, 480px)',
          aspectRatio: '1 / 1',
          perspective: 1200,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Lueur bleue ─────────────────────────────────────────── */}
        <motion.div
          animate={{
            opacity: hovered ? [0.55, 1,    0.55] : [0.2, 0.45, 0.2],
            scale:   hovered ? [1.0,  1.16, 1.0 ] : [1.0, 1.08, 1.0],
          }}
          transition={{ duration: hovered ? 3.2 : 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: '-16%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(74,143,255,0.65) 0%, transparent 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
        {/* ── Lueur rouge décalée ──────────────────────────────────── */}
        <motion.div
          animate={{
            opacity: hovered ? [0.45, 0.85, 0.45] : [0.1, 0.3, 0.1],
            scale:   hovered ? [1.08, 1.22, 1.08] : [1.05, 1.13, 1.05],
          }}
          transition={{ duration: hovered ? 3.8 : 7.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', inset: '-12%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,40,90,0.5) 0%, transparent 70%)',
            filter: 'blur(38px)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />

        {/* ── Lévitation ──────────────────────────────────────────── */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', inset: 0,
            transformStyle: 'preserve-3d',
            cursor: 'none',
          }}
          onClick={() => setFlipped(f => !f)}
        >
          {/* ── Flipper ─────────────────────────────────────────────── */}
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%', height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Recto */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
            }}>
              <img
                src={frontSrc}
                alt="A Piece Of Sky — Recto"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </div>

            {/* Verso */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
            }}>
              <img
                src={backSrc}
                alt="A Piece Of Sky — Verso"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                draggable={false}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Hint cliquable */}
        <motion.p
          animate={{ opacity: [0.18, 0.38, 0.18] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: '-1.6rem',
            left: 0, right: 0,
            textAlign: 'center',
            fontSize: '0.58rem',
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
            margin: 0,
          }}
        >
          {flipped ? '← recto' : 'verso →'}
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ── Grand embed 450px (EP, Live Set) ────────────────────────────── */
function LargeEmbed({ item }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <iframe
        title={item.label}
        width="100%"
        height="450"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={scUrl(item.path, true)}
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}

/* ── Embed compact 166px ─────────────────────────────────────────── */
function SmallEmbed({ item, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 45, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, delay: (index % 4) * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.015)',
      }}
    >
      <iframe
        title={item.label}
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={scUrl(item.path, false)}
        style={{ display: 'block' }}
      />
    </motion.div>
  );
}

/* ── Embed exclusif 166px + badge ────────────────────────────────── */
function ExclusiveEmbed({ item, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 45, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      <div style={{
        position: 'absolute', top: 10, right: 10, zIndex: 10,
        padding: '3px 9px',
        background: 'rgba(255,40,90,0.85)',
        borderRadius: 3,
        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em',
        color: '#fff',
        pointerEvents: 'none',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 0 12px rgba(255,40,90,0.5)',
      }}>
        Exclusif
      </div>
      <div style={{
        borderRadius: 6, overflow: 'hidden',
        border: '1px solid rgba(255,40,90,0.2)',
        background: 'rgba(255,255,255,0.015)',
      }}>
        <iframe
          title={item.label}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={scUrl(item.path, false)}
          style={{ display: 'block' }}
        />
      </div>
    </motion.div>
  );
}

/* ── SC Widget API bridge ─────────────────────────────────────────── */
function useSCWidgetBridge({ setScTitle, setScPlaying, setScProgress, setScCurrentTime, setScDuration, registerWidget, activateWidget }) {
  useEffect(() => {
    if (!document.getElementById('sc-widget-api')) {
      const script = document.createElement('script');
      script.id  = 'sc-widget-api';
      script.src = 'https://w.soundcloud.com/player/api.js';
      document.body.appendChild(script);
    }

    const bindWidgets = () => {
      if (!window.SC?.Widget) return false;
      const iframes = document.querySelectorAll('iframe[src*="soundcloud.com"]');
      if (!iframes.length) return false;

      iframes.forEach((iframe, idx) => {
        if (iframe.__scBound) return;
        iframe.__scBound = true;

        const widget = window.SC.Widget(iframe);
        registerWidget(widget, idx);

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          activateWidget(widget, idx);
          setScPlaying(true);
          setScTitle('Live Set'); // fallback immédiat pour activer le mode SC
          widget.getCurrentSound(sound => {
            if (sound?.title) setScTitle(sound.title);
          });
          widget.getDuration(d => setScDuration(d));
        });
        widget.bind(window.SC.Widget.Events.PAUSE,  () => setScPlaying(false));
        widget.bind(window.SC.Widget.Events.FINISH, () => {
          setScPlaying(false); setScProgress(0);
          setScCurrentTime(0); setScDuration(0); setScTitle(null);
        });
        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, e => {
          setScProgress(e.relativePosition * 100);
          setScCurrentTime(e.currentPosition);
        });
      });
      return true;
    };

    const interval = setInterval(() => { if (bindWidgets()) clearInterval(interval); }, 600);
    return () => clearInterval(interval);
  }, [setScTitle, setScPlaying, setScProgress, setScCurrentTime, setScDuration, registerWidget, activateWidget]);
}

/* ── Section Musique ──────────────────────────────────────────────── */
export default function Music() {
  const { t } = useLang();
  const { setScTitle, setScPlaying, setScProgress, setScCurrentTime, setScDuration, registerWidget, activateWidget } = useAudio();
  const titleRef    = useRef(null);
  const titleInView = useInView(titleRef, { once: false, amount: 0.3 });
  const glow        = useSectionGlow();

  useSCWidgetBridge({ setScTitle, setScPlaying, setScProgress, setScCurrentTime, setScDuration, registerWidget, activateWidget });

  return (
    <section id="music" className="section-pad" style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: '50%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(74,143,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Titre de section ──────────────────────────────────────── */}
      <div ref={titleRef} style={{ marginBottom: '4rem' }}>
        <motion.div
          initial={{ scaleX: 50 }}
          animate={titleInView ? { scaleX: 1 } : { scaleX: 50 }}
          transition={{ duration: 3.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
              ? { duration: 5.0, delay: 0.3, times: [0, 0.06, 0.11, 0.17, 0.24, 0.32, 0.39, 0.46, 0.54, 0.61, 0.78, 1] }
              : { duration: 0.6 },
            y: { duration: 2.6, delay: 0.2 },
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
          {t.music.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
          animate={titleInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{ duration: 2.6, delay: 0.6 }}
          style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}
        >
          {t.music.subtitle}
        </motion.p>
      </div>

      {/* ── Live Set ───────────────────────────────────────────────── */}
      <SectionLabel>Live Set 2026</SectionLabel>
      <LargeEmbed item={LIVE_SET} />

      {/* ── EP — pochette à gauche, embed à droite ─────────────────── */}
      <SectionLabel mt>EP</SectionLabel>
      <div className="music-ep-grid">
        <div style={{ flex: '1 1 360px' }}>
          <VinylFlip />
          {/* Credits */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.6 }}
            style={{ marginTop: '1.6rem', paddingLeft: '0.2rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                { handle: 'laetishirt',          role: 'Creative Director' },
                { handle: 'rhyspll',             role: 'Photographer' },
                { handle: 'emotionalriots',      role: 'Studio and Light Assistant' },
                { handle: 'sbizien',             role: 'Hairstylist' },
                { handle: 'kipras_mash',         role: 'Hairstylist Assistant' },
                { handle: 'lucianprietosanchez', role: 'Stylist' },
                { handle: 'alv_mua',             role: 'Make Up Artist' },
              ].map(({ handle, role }) => (
                <span key={handle} style={{ fontSize: '0.62rem', color: 'rgba(212,216,240,0.35)', letterSpacing: '0.03em' }}>
                  <a
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(212,216,240,0.6)', textDecoration: 'none', cursor: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,216,240,0.95)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,216,240,0.6)'}
                  >@{handle}</a>
                  {' '}· {role}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '0.7rem', fontSize: '0.62rem', color: 'rgba(212,216,240,0.35)', letterSpacing: '0.03em' }}>
              {'Brands : '}
              {['afrobodega', 'sangiev'].map((handle, i, arr) => (
                <span key={handle}>
                  <a
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(212,216,240,0.6)', textDecoration: 'none', cursor: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,216,240,0.95)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,216,240,0.6)'}
                  >@{handle}</a>
                  {i < arr.length - 1 ? ' and ' : ''}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.62rem', color: 'rgba(212,216,240,0.35)', letterSpacing: '0.03em' }}>
              {'Thanks to '}
              {['csc.records666', 'studio_cvpo'].map((handle, i, arr) => (
                <span key={handle}>
                  <a
                    href={`https://instagram.com/${handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(212,216,240,0.6)', textDecoration: 'none', cursor: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,216,240,0.95)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,216,240,0.6)'}
                  >@{handle}</a>
                  {i < arr.length - 1 ? ' and ' : ''}
                </span>
              ))}
              {' for the Artwork.'}
            </div>
          </motion.div>
        </div>
        <div style={{ flex: '1 1 320px' }}>
          <LargeEmbed item={EP} />
        </div>
      </div>

      {/* ── Exclusifs ──────────────────────────────────────────────── */}
      <SectionLabel mt>Exclusifs</SectionLabel>
      <div className="embeds-grid">
        {EXCLUSIVES.map((item, i) => (
          <ExclusiveEmbed key={item.path} item={item} index={i} />
        ))}
      </div>

      {/* ── Singles ────────────────────────────────────────────────── */}
      <SectionLabel mt>Singles</SectionLabel>
      <div className="embeds-grid">
        {SINGLES.map((item, i) => (
          <SmallEmbed key={item.path} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
