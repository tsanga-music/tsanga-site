import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '../../context/LangContext';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useSectionGlow } from '../../hooks/useSectionGlow';

const STATUS_STYLES = {
  'on sale':    { bg: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', border: 'rgba(255,255,255,0.15)', label: '● on sale' },
  'sold out':   { bg: 'rgba(255,80,80,0.10)',  color: '#ff5050', border: 'rgba(255,80,80,0.3)',  label: '● sold out' },
  'annoncé':    { bg: 'rgba(180,180,180,0.08)',color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.12)', label: '○ annoncé' },
  'announced':  { bg: 'rgba(180,180,180,0.08)',color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.12)', label: '○ announced' },
  'angekündigt':{ bg: 'rgba(180,180,180,0.08)',color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.12)', label: '○ angekündigt' },
};

function DateRow({ date, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const status = STATUS_STYLES[date.status] || STATUS_STYLES['annoncé'];

  const hasTickets = date.status !== 'sold out' && date.status !== 'annoncé' && date.status !== 'announced' && date.status !== 'angekündigt';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        whileHover={{ background: 'rgba(74,143,255,0.04)', borderColor: 'rgba(74,143,255,0.18)' }}
        className="date-row-grid"
        style={{
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 4,
          cursor: 'none',
          transition: 'background 0.3s, border-color 0.3s',
        }}
      >
        {/* [1] Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
          <Calendar size={11} />
          <span style={{ letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{date.date}</span>
        </div>

        {/* [2] City + Venue */}
        <div className="date-row-city">
          <div style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            {date.city}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>
            <MapPin size={10} />
            <span>{date.venue}</span>
          </div>
        </div>

        {/* [3] Status badge */}
        <div className="date-row-status" style={{
          padding: '4px 10px',
          borderRadius: 2,
          background: status.bg,
          border: `1px solid ${status.border}`,
          fontSize: '0.65rem',
          letterSpacing: '0.04em',
          color: status.color,
          whiteSpace: 'nowrap',
        }}>
          {status.label}
        </div>

        {/* [4] Tickets button */}
        <div className="date-row-btn">
          {hasTickets ? (
            <motion.button
              whileHover={{ background: 'rgba(74,143,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '6px 14px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 2,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.68rem',
                letterSpacing: '0.04em',
                cursor: 'none',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s',
              }}
            >
              <ExternalLink size={11} />
              Tickets
            </motion.button>
          ) : (
            <div />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Lives() {
  const { t } = useLang();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });
  const glow = useSectionGlow();

  return (
    <section id="lives" className="section-pad" style={{ position: 'relative' }}>
      {/* Big ambient blur */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, rgba(74,143,255,0.3), transparent)',
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
          {t.lives.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ fontSize: '0.75rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.35)', marginTop: '0.6rem' }}
        >
          {t.lives.subtitle}
        </motion.p>
      </div>

      {/* Date list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {t.lives.dates.map((date, i) => (
          <DateRow key={`${date.city}-${i}`} date={date} index={i} />
        ))}
      </div>

      {/* Booking CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="booking-cta"
        style={{
          marginTop: '3rem',
          padding: '2rem',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 4,
        }}
      >
        <div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', margin: 0 }}>
            {t.contact.booking}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', margin: '0.3rem 0 0' }}>
            booking@tsanga.be
          </p>
        </div>
        <motion.a
          href="mailto:booking@tsanga.be"
          whileHover={{ background: 'rgba(74,143,255,0.15)' }}
          style={{
            padding: '0.75rem 2rem',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 2,
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.72rem',
            letterSpacing: '0.04em',
            textDecoration: 'none',
            cursor: 'none',
            transition: 'background 0.2s',
          }}
        >
          Booking
        </motion.a>
      </motion.div>
    </section>
  );
}
