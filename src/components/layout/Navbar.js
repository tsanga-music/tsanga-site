import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import navLogoSrc from '../../tsangalogosansfond.png';
import { useLang } from '../../context/LangContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';

const SECTIONS = ['gallery', 'music', 'shop', 'lives', 'contact'];
const LANGS = ['fr', 'en', 'de'];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [clock, setClock] = useState('');
  const langRef = useRef(null);

  /* ── Scroll detection ─────────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Horloge Bruxelles — Intl.DateTimeFormat (fiable) ───────────── */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Brussels',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => setClock(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Ferme le dropdown langue au clic extérieur ──────────────────── */
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 1000, padding: '0 2rem', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled ? 'rgba(4,4,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'background 0.4s, border-color 0.4s, backdrop-filter 0.4s',
        }}
      >
        {/* ── Logo ────────────────────────────────────────────────────── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'none', padding: 0, flexShrink: 0 }}
        >
          <img
            src={navLogoSrc}
            alt="TSANGA"
            className="nav-logo"
            style={{ height: 32, width: 'auto', display: 'block' }}
          />
        </button>

        {/* ── Liens desktop — apparaissent au scroll ──────────────────── */}
        <motion.div
          animate={{
            opacity: scrolled ? 1 : 0,
            y: scrolled ? 0 : -8,
            pointerEvents: scrolled ? 'auto' : 'none',
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
          className="desktop-nav"
        >
          {SECTIONS.map((s) => (
            <NavLink key={s} onClick={() => scrollTo(s)}>{t.nav[s]}</NavLink>
          ))}
        </motion.div>

        {/* ── Droite : localisation + langue + panier + mobile toggle ─── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>

          {/* Localisation BXL */}
          <span className="desktop-nav" style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            fontSize: '0.78rem', letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.4)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span className="nav-status-dot" />
            Bxl {clock}
          </span>

          {/* ── Dropdown langue — police système pour lisibilité ─────── */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 3,
                padding: '5px 10px',
                cursor: 'none',
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.8)',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                transition: 'border-color 0.2s',
              }}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
              <ChevronDown size={11} style={{
                transition: 'transform 0.2s',
                transform: langOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scaleY: 0.88 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -6, scaleY: 0.88 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: '70px',
                    background: 'rgba(8,8,18,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    backdropFilter: 'blur(20px)',
                    overflow: 'hidden',
                    transformOrigin: 'top right',
                    zIndex: 200,
                  }}
                >
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      style={{
                        display: 'block', width: '100%',
                        padding: '0.5rem 1rem',
                        background: l === lang ? 'rgba(74,143,255,0.12)' : 'none',
                        border: 'none',
                        color: l === lang ? '#fff' : 'rgba(255,255,255,0.48)',
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
                        textAlign: 'left', cursor: 'none',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => { if (l !== lang) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if (l !== lang) e.currentTarget.style.background = 'none'; }}
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Panier */}
          <button onClick={() => setOpen(true)}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '50px',
              padding: '6px 14px 6px 10px',
              cursor: 'none',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem',
            }}>
            <ShoppingBag size={14} color="rgba(255,255,255,0.55)" />
            {count > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', borderRadius: '50%',
                width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700,
              }}>{count}</span>
            )}
          </button>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'none', color: '#fff', display: 'none' }}
            className="mobile-menu-btn">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* ── Menu mobile ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 999,
              background: 'rgba(4,4,10,0.97)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '1.5rem 2rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
            {SECTIONS.map((s) => (
              <button key={s} onClick={() => scrollTo(s)}
                style={{
                  background: 'none', border: 'none', cursor: 'none',
                  color: 'rgba(255,255,255,0.75)', fontFamily: 'inherit',
                  fontSize: '1rem', letterSpacing: '0.04em',
                  textAlign: 'left', padding: '0.5rem 0',
                }}>
                {t.nav[s]}
              </button>
            ))}

            {/* Heure mobile */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              fontSize: '0.75rem', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.3)',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span className="nav-status-dot" />
              Bxl {clock}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ color: 'rgba(255,255,255,1)' }}
      style={{
        background: 'none', border: 'none', cursor: 'none',
        color: 'rgba(255,255,255,0.45)',
        fontFamily: 'inherit',
        fontSize: '1.1rem', letterSpacing: '0.04em',
        padding: 0,
        transition: 'color 0.2s',
      }}>
      {children}
    </motion.button>
  );
}
