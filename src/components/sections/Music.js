import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { useSectionGlow } from '../../hooks/useSectionGlow';
import { useAudio } from '../../context/AudioContext';

const SC_TRACK_BASE = 'https://soundcloud.com/tsanga-berlin/';
const SC_PLAYER     = 'https://w.soundcloud.com/player/?url=';
const SC_PARAMS     = '&color=%23d4d8f0&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=true';

const LIVE_SET = {
  url:   'https://soundcloud.com/tsanga-berlin/20260321-live-set-2026-tsanga/s-tuo0lMPjbNw',
  label: 'Live Set 2026',
};

const EP = {
  slug: 'sets/a-piece-of-sky-final',
  label: 'EP — A Piece Of Sky',
};

const EXCLUSIVES = [
  { url: 'https://soundcloud.com/tsanga-berlin/20260318-virus/s-oQHhq2CjlBM',          label: 'Virus' },
  { url: 'https://soundcloud.com/tsanga-berlin/20260320-back-and-i-feel-the/s-i9fW3MpEDiT', label: 'Back And I Feel The' },
];

const SINGLES = [
  { slug: 'my-way-through',                    label: 'My Way Through' },
  { slug: 'tsanga-none-of-this-shit-2',        label: 'None Of This Shit' },
  { slug: 'tsanga-reason-mst-final2-1',        label: 'Reason' },
  { slug: 'tsanga-voidy-inside-mst-1',         label: 'Voidy Inside' },
  { slug: 'tsanga-pink-truck-mst-final2-1',    label: 'Pink Truck' },
  { slug: 'tsanga-lost-my-way-mst-1',          label: 'Lost My Way' },
  { slug: 'tsanga-darker-days-mst-1',          label: 'Darker Days' },
  { slug: 'tsanga-voidy-inside-jean-1',        label: 'Voidy Inside (Jean remix)' },
];

/* slug  → URL encodée (tracks publics) */
function scUrl(slug) {
  return `${SC_PLAYER}${encodeURIComponent(SC_TRACK_BASE + slug)}${SC_PARAMS}`;
}

/* URL complète avec token privé → URL encodée */
function scUrlFull(url) {
  return `${SC_PLAYER}${encodeURIComponent(url)}${SC_PARAMS}`;
}

/* ── Label de section (EP / LIVE SET / EXCLUSIFS / SINGLES) ─────── */
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

/* ── Embed EP (grand player visuel) ──────────────────────────────── */
function EpEmbed({ ep, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <iframe
        title={ep.label}
        width="100%"
        height="450"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={scUrl(ep.slug)}
        style={{ display: 'block', borderRadius: 6 }}
      />
    </motion.div>
  );
}

/* ── Embed single (player compact) ───────────────────────────────── */
function SingleEmbed({ track, index }) {
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
        title={track.label}
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={scUrl(track.slug)}
        style={{ display: 'block', borderRadius: 6 }}
      />
    </motion.div>
  );
}

/* ── Embed Live Set (grand player, même style que EP) ────────────── */
function LiveSetEmbed({ liveSet }) {
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
        title={liveSet.label}
        width="100%"
        height="450"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={scUrlFull(liveSet.url)}
        style={{ display: 'block', borderRadius: 6 }}
      />
    </motion.div>
  );
}

/* ── Embed exclusif (compact + badge) ────────────────────────────── */
function ExclusiveEmbed({ track, index }) {
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
      {/* Badge Exclusif */}
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
          title={track.label}
          width="100%"
          height="166"
          scrolling="no"
          frameBorder="no"
          allow="autoplay"
          src={scUrlFull(track.url)}
          style={{ display: 'block', borderRadius: 6 }}
        />
      </div>
    </motion.div>
  );
}

/* ── SC Widget API bridge ────────────────────────────────────────── */
function useSCWidgetBridge(setScTitle) {
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
      iframes.forEach((iframe) => {
        if (iframe.__scBound) return;
        iframe.__scBound = true;
        const widget = window.SC.Widget(iframe);
        widget.bind(window.SC.Widget.Events.PLAY, () => {
          widget.getCurrentSound((sound) => {
            if (sound?.title) setScTitle(sound.title);
          });
        });
        widget.bind(window.SC.Widget.Events.PAUSE,  () => setScTitle(null));
        widget.bind(window.SC.Widget.Events.FINISH, () => setScTitle(null));
      });
      return true;
    };

    const interval = setInterval(() => {
      if (bindWidgets()) clearInterval(interval);
    }, 600);

    return () => clearInterval(interval);
  }, [setScTitle]);
}

/* ── Section Musique ─────────────────────────────────────────────── */
export default function Music() {
  const { t } = useLang();
  const { setScTitle } = useAudio();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();

  useSCWidgetBridge(setScTitle);

  return (
    <section id="music" style={{
      padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 6vw, 5rem)',
      position: 'relative',
    }}>
      {/* Accent background */}
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

      {/* ── Live Set ────────────────────────────────────────────────── */}
      <SectionLabel>LIVE SET 2026</SectionLabel>
      <LiveSetEmbed liveSet={LIVE_SET} />

      {/* ── EP en grand ────────────────────────────────────────────── */}
      <SectionLabel mt>EP</SectionLabel>
      <EpEmbed ep={EP} index={0} />

      {/* ── Exclusifs ───────────────────────────────────────────────── */}
      <SectionLabel mt>EXCLUSIFS</SectionLabel>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {EXCLUSIVES.map((track, i) => (
          <ExclusiveEmbed key={track.url} track={track} index={i} />
        ))}
      </div>

      {/* ── Singles ────────────────────────────────────────────────── */}
      <SectionLabel mt>SINGLES</SectionLabel>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem',
      }}>
        {SINGLES.map((track, i) => (
          <SingleEmbed key={track.slug} track={track} index={i} />
        ))}
      </div>
    </section>
  );
}
