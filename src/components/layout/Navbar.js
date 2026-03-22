import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import navLogoSrc from '../../tsangalogosansfond.png';   // logo déjà transparent
import { useLang } from '../../context/LangContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

const SECTIONS = ['gallery', 'music', 'shop', 'lives', 'contact'];

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString('fr-BE', {
        timeZone: 'Europe/Brussels',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

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
        {/* ── Logo transparent + hover cycle chromatique ─────────────── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ background: 'none', border: 'none', cursor: 'none', padding: 0 }}
        >
          {/*
            .nav-logo : défini dans index.css
            filter: brightness(1) au repos
            :hover → animation nav-logo-cycle (hue-rotate bleu→violet→rouge→cyan)
          */}
          <img
            src={navLogoSrc}
            alt="TSANGA"
            className="nav-logo"
            style={{ height: 32, width: 'auto', display: 'block' }}
          />
        </button>

        {/* ── Desktop nav ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
          className="desktop-nav">
          {SECTIONS.map((s) => (
            <NavLink key={s} onClick={() => scrollTo(s)}>{t.nav[s]}</NavLink>
          ))}
        </div>

        {/* ── Right actions ───────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>

          {/* Horloge Bruxelles */}
          <span className="desktop-nav" style={{
            fontSize: '1rem',
            letterSpacing: '0.06em',
            color: '#ffffff',
            fontVariantNumeric: 'tabular-nums',
            marginRight: '2rem',
          }}>
            Bruxelles {clock}
          </span>

          {/* Langue */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['fr', 'en', 'de'].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                style={{
                  background: 'none', border: 'none', cursor: 'none',
                  fontFamily: 'inherit', fontSize: '0.9rem',
                  letterSpacing: '0.04em',
                  color: lang === l ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.32)',
                  fontWeight: lang === l ? 700 : 400,
                  transition: 'color 0.2s', padding: '6px 10px',
                }}>
                {l}
              </button>
            ))}
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

      {/* ── Menu mobile ─────────────────────────────────────────────── */}
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
