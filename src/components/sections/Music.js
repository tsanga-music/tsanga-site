import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';
import { useAudio } from '../../context/AudioContext';
import pochetteSrc from '../../assets/pochette-back-transparent.png';

/* ── Constructeur d'URL SoundCloud ───────────────────────────────────
   Seul le ":" de https: est encodé en %3A, les "/" restent lisibles.
   visual=true  → grand player avec artwork (450px)
   visual=false → player compact (166px)
────────────────────────────────────────────────────────────────────── */
const SC_PARAMS = '&color=%23d4d8f0&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false';

function scUrl(path, visual = false) {
  // Tracks privées : path contient "/s-XXXXX" → extrait en &secret_token=
  const tokenMatch = path.match(/\/s-([A-Za-z0-9]+)$/);
  const cleanPath  = tokenMatch ? path.slice(0, path.lastIndexOf('/s-')) : path;
  const tokenParam = tokenMatch ? `&secret_token=s-${tokenMatch[1]}` : '';
  return `https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/tsanga-berlin/${cleanPath}${tokenParam}${SC_PARAMS}&visual=${visual}`;
}

/* ── Données ─────────────────────────────────────────────────────── */
const LIVE_SET = { path: '20260321-live-set-2026-tsanga/s-tuo0lMPjbNw', label: 'Live Set 2026' };
const EP       = { path: 'sets/a-piece-of-sky-final',                    label: 'EP — A Piece Of Sky' };

const EXCLUSIVES = [
  { path: '20260318-virus/s-oQHhq2CjlBM',          label: 'Virus' },
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
      transition={{ duration: 0.6 }}
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

/* ── Grand embed 450px (EP, Live Set) ────────────────────────────── */
function LargeEmbed({ item }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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

/* ── Embed compact 166px (singles) ──────────────────────────────── */
function SmallEmbed({ item, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative' }}
    >
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        padding: '3px 9px',
        background: 'rgba(255,40,90,0.85)',
        borderRadius: 3,
        fontSize: '0.58rem',
        fontWeight: 700,
        letterSpacing: '0.1em',
        color: '#fff',
        pointerEvents: 'none',
        backdropFilter: 'blur(6px)',
        boxShadow: '0 0 12px rgba(255,40,90,0.5)',
      }}>
        EXCLUSIF
      </div>
      <div style={{
        borderRadius: 6,
        overflow: 'hidden',
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

/* ── Pochette arrière EP avec lueur et lévitation ────────────────── */
function PochetteBack() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}
    >
      {/* Conteneur relatif pour les lueurs */}
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Lueur bleue derrière */}
        <motion.div
          animate={{
            opacity: hovered ? [0.6, 1, 0.6] : [0.25, 0.5, 0.25],
            scale:   hovered ? [1.05, 1.18, 1.05] : [1, 1.1, 1],
          }}
          transition={{ duration: hovered ? 1.8 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '-18%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(74,143,255,0.55) 0%, transparent 70%)',
            filter: 'blur(28px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Lueur rouge/rose derrière (décalée dans le temps) */}
        <motion.div
          animate={{
            opacity: hovered ? [0.5, 0.9, 0.5] : [0.15, 0.35, 0.15],
            scale:   hovered ? [1.1, 1.22, 1.1] : [1.05, 1.15, 1.05],
          }}
          transition={{ duration: hovered ? 2.2 : 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          style={{
            position: 'absolute',
            inset: '-14%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,40,90,0.45) 0%, transparent 70%)',
            filter: 'blur(32px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Image avec lévitation douce */}
        <motion.img
          src={pochetteSrc}
          alt="EP A Piece Of Sky — pochette arrière"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            width: 'clamp(220px, 30vw, 380px)',
            height: 'auto',
            display: 'block',
            filter: hovered
              ? 'drop-shadow(0 0 18px rgba(74,143,255,0.7)) drop-shadow(0 0 36px rgba(255,40,90,0.4))'
              : 'drop-shadow(0 4px 20px rgba(0,0,0,0.6))',
            transition: 'filter 0.4s ease',
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── SC Widget API bridge ────────────────────────────────────────── */
function useSCWidgetBridge({ setScTitle, setScPlaying, setScProgress, registerWidget, activateWidget }) {
  useEffect(() => {
    if (!document.getElementById('sc-widget-api')) {
      const script = document.createElement('script');
      script.id = 'sc-widget-api';
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
          widget.getCurrentSound((sound) => {
            if (sound?.title) setScTitle(sound.title);
          });
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setScPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          setScPlaying(false);
          setScProgress(0);
          setScTitle(null);
        });

        widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e) => {
          setScProgress(e.relativePosition * 100);
        });
      });
      return true;
    };

    const interval = setInterval(() => {
      if (bindWidgets()) clearInterval(interval);
    }, 600);

    return () => clearInterval(interval);
  }, [setScTitle, setScPlaying, setScProgress, registerWidget, activateWidget]);
}

/* ── Section Musique ─────────────────────────────────────────────── */
export default function Music() {
  const { t } = useLang();
  const { setScTitle, setScPlaying, setScProgress, registerWidget, activateWidget } = useAudio();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();

  useSCWidgetBridge({ setScTitle, setScPlaying, setScProgress, registerWidget, activateWidget });

  return (
    <section id="music" style={{
      padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '20%', right: '-10%',
        width: '50%', height: '60%',
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
          {t.music.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}
        >
          {t.music.subtitle}
        </motion.p>
      </div>

      {/* Live Set */}
      <SectionLabel>LIVE SET 2026</SectionLabel>
      <LargeEmbed item={LIVE_SET} />

      {/* EP */}
      <SectionLabel mt>EP</SectionLabel>
      <PochetteBack />
      <LargeEmbed item={EP} />

      {/* Exclusifs */}
      <SectionLabel mt>EXCLUSIFS</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {EXCLUSIVES.map((item, i) => (
          <ExclusiveEmbed key={item.path} item={item} index={i} />
        ))}
      </div>

      {/* Singles */}
      <SectionLabel mt>SINGLES</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {SINGLES.map((item, i) => (
          <SmallEmbed key={item.path} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
