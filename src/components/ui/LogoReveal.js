import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logoSrc from '../../assets/tsanga_logo.png';

/* ─────────────────────────────────────────────────────────────────────────
   Canvas : suppression du fond par luminosité normalisée
───────────────────────────────────────────────────────────────────────── */
function useTransparentLogo(src) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const S = 10;
      const regions = [
        ctx.getImageData(0, 0, S, S),
        ctx.getImageData(w - S, 0, S, S),
        ctx.getImageData(0, h - S, S, S),
        ctx.getImageData(w - S, h - S, S, S),
      ];
      let lumSum = 0, lumCount = 0;
      regions.forEach(({ data }) => {
        for (let i = 0; i < data.length; i += 4) {
          lumSum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          lumCount++;
        }
      });
      const bgLum    = lumSum / lumCount;
      const threshold = bgLum + 18;
      const range     = 255 - threshold;

      const img2 = ctx.getImageData(0, 0, w, h);
      const d = img2.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        const norm = Math.max(0, (lum - threshold) / range);
        d[i + 3] = Math.round(Math.pow(norm, 0.5) * 255);
      }
      ctx.putImageData(img2, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  return dataUrl;
}

/* ─────────────────────────────────────────────────────────────────────────
   LogoReveal — effet TV cathodique
───────────────────────────────────────────────────────────────────────── */
export default function LogoReveal() {
  const src = useTransparentLogo(logoSrc);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{CSS}</style>

      <div
        style={{ position: 'relative', display: 'inline-block', cursor: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >

        {/* ── GLOW 1 — bleu/violet/rouge ─────────────────────────────── */}
        {src && (
          <img src={src} alt="" aria-hidden style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            mixBlendMode: 'screen',
            transform: 'scale(1.04)',
            pointerEvents: 'none', zIndex: 0,
            animation: 'tsanga-glow1 6s linear infinite',
          }} />
        )}

        {/* ── GLOW 2 — décalé, légèrement plus large ──────────────────── */}
        {src && (
          <img src={src} alt="" aria-hidden style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            mixBlendMode: 'screen',
            transform: 'scale(1.08)',
            pointerEvents: 'none', zIndex: 0,
            animation: 'tsanga-glow2 8s linear infinite',
          }} />
        )}

        {/* ── REVEAL + HOVER ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(18px)' }}
          animate={src ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0 }}
          transition={{ duration: 1.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={hovered ? { scale: [1, 1.05, 1.02, 1.05, 1] } : { scale: 1 }}
            transition={hovered
              ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.5 }
            }
          >
            {src && (
              <img
                src={src}
                alt="TSANGA"
                style={{
                  display: 'block',
                  width: 'clamp(260px, 46vw, 540px)',
                  height: 'auto',
                  animation: 'tsanga-crt-glitch 10s steps(1, end) infinite, tsanga-tint 12s linear infinite',
                }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* ── GHOST — aberration chromatique cyan/rouge ────────────────── */}
        {src && (
          <img src={src} alt="" aria-hidden style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            mixBlendMode: 'screen',
            opacity: 0,
            pointerEvents: 'none', zIndex: 3,
            animation: 'tsanga-crt-ghost 10s steps(1, end) infinite',
          }} />
        )}

        {/* ── SCANLINES — lignes horizontales cathodiques ──────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.13) 3px, rgba(0,0,0,0.13) 4px)',
          pointerEvents: 'none', zIndex: 4,
        }} />

        {/* ── BARRE DE BALAYAGE — sync line CRT ───────────────────────── */}
        {src && (
          <div style={{
            position: 'absolute',
            left: 0, right: 0,
            height: 6,
            background: 'linear-gradient(90deg, transparent 0%, rgba(180,220,255,0.22) 25%, rgba(200,230,255,0.32) 50%, rgba(180,220,255,0.22) 75%, transparent 100%)',
            pointerEvents: 'none', zIndex: 5,
            animation: 'tsanga-crt-bar 10s linear infinite',
          }} />
        )}

      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CSS — animations TV cathodique
───────────────────────────────────────────────────────────────────────── */
const CSS = `

  /* ── Glow 1 ──────────────────────────────────────────────────────── */
  @keyframes tsanga-glow1 {
    0%   { filter: blur(5px) brightness(6) saturate(14) hue-rotate(192deg); opacity: 0.9; }
    25%  { filter: blur(5px) brightness(6) saturate(14) hue-rotate(260deg); opacity: 1;   }
    50%  { filter: blur(5px) brightness(6) saturate(14) hue-rotate(330deg); opacity: 0.8; }
    75%  { filter: blur(5px) brightness(6) saturate(14) hue-rotate(150deg); opacity: 1;   }
    100% { filter: blur(5px) brightness(6) saturate(14) hue-rotate(192deg); opacity: 0.9; }
  }

  /* ── Glow 2 ──────────────────────────────────────────────────────── */
  @keyframes tsanga-glow2 {
    0%   { filter: blur(8px) brightness(7) saturate(16) hue-rotate(330deg); opacity: 0.6; }
    25%  { filter: blur(8px) brightness(7) saturate(16) hue-rotate(150deg); opacity: 0.9; }
    50%  { filter: blur(8px) brightness(7) saturate(16) hue-rotate(192deg); opacity: 0.5; }
    75%  { filter: blur(8px) brightness(7) saturate(16) hue-rotate(260deg); opacity: 0.8; }
    100% { filter: blur(8px) brightness(7) saturate(16) hue-rotate(330deg); opacity: 0.6; }
  }

  /* ── Tint changeant sur le logo ──────────────────────────────────── */
  @keyframes tsanga-tint {
    0%   { filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.05); }
    25%  { filter: sepia(0.35) saturate(5) hue-rotate(260deg) brightness(1.05); }
    50%  { filter: sepia(0.35) saturate(5) hue-rotate(330deg) brightness(1.05); }
    75%  { filter: sepia(0.35) saturate(5) hue-rotate(150deg) brightness(1.05); }
    100% { filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.05); }
  }

  /* ── CRT Glitch — TV cathodique qui bogue ────────────────────────────
     Cycle 10s, steps(1, end) = transitions snap sans interpolation.
     Deux bursts : burst 1 (80-86%), burst 2 (90-96%) plus violent.
     Chaque burst : bandes horizontales déplacées indépendamment,
     séparation chromatique, flash phosphore, blackout de re-sync.
  */
  @keyframes tsanga-crt-glitch {

    /* Repos */
    0%, 79.9% {
      transform: translate(0,0) skewX(0deg);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.05);
      opacity: 1;
    }

    /* === BURST 1 (80-86%) ========================================= */

    /* Bande haute — glisse fort à droite */
    80% {
      transform: translate(16px, 0) skewX(-2.5deg);
      clip-path: inset(0 0 76% 0);
      filter: sepia(0) saturate(3) hue-rotate(150deg) brightness(2);
      opacity: 1;
    }
    /* Bande milieu-haut — glisse à gauche, assombrie */
    80.8% {
      transform: translate(-13px, 0) skewX(2deg);
      clip-path: inset(24% 0 52% 0);
      filter: brightness(0.4);
      opacity: 0.85;
    }
    /* Bande milieu-bas — glisse à droite, sursaturation rouge */
    81.6% {
      transform: translate(10px, 2px) skewX(-1.2deg);
      clip-path: inset(48% 0 28% 0);
      filter: sepia(0) saturate(14) hue-rotate(330deg) brightness(1.8);
      opacity: 1;
    }
    /* Bande basse — glisse à gauche, cyan */
    82.4% {
      transform: translate(-9px, -2px) skewX(0.8deg);
      clip-path: inset(72% 0 6% 0);
      filter: sepia(0) saturate(10) hue-rotate(150deg) brightness(1.5);
      opacity: 0.9;
    }
    /* Flash phosphore — tout blanc */
    83.2% {
      transform: translate(0,0);
      clip-path: none;
      filter: brightness(5) saturate(0);
      opacity: 1;
    }
    /* Blackout de re-synchronisation */
    84% {
      transform: translate(0,0);
      clip-path: none;
      filter: brightness(0);
      opacity: 1;
    }
    /* Récupération — léger décalage résiduel */
    84.8% {
      transform: translate(-3px, 0) skewX(-0.3deg);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(0.88);
      opacity: 1;
    }
    /* Retour normal */
    85.6%, 89.9% {
      transform: translate(0,0) skewX(0deg);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.05);
      opacity: 1;
    }

    /* === BURST 2 (90-96%) — plus violent, plus de bandes ========== */

    /* Bande très haute — displacement extrême */
    90% {
      transform: translate(20px, 0) skewX(-3.5deg);
      clip-path: inset(0 0 86% 0);
      filter: sepia(0) saturate(2) hue-rotate(330deg) brightness(3);
      opacity: 1;
    }
    /* Bande haute-milieu */
    90.7% {
      transform: translate(-17px, 0) skewX(3deg);
      clip-path: inset(14% 0 68% 0);
      filter: brightness(0.25);
      opacity: 0.75;
    }
    /* Bande milieu */
    91.4% {
      transform: translate(13px, -3px) skewX(-2deg);
      clip-path: inset(32% 0 48% 0);
      filter: sepia(0) saturate(18) hue-rotate(192deg) brightness(2.2);
      opacity: 1;
    }
    /* Bande milieu-bas */
    92.1% {
      transform: translate(-10px, 2px) skewX(1.5deg);
      clip-path: inset(52% 0 28% 0);
      filter: sepia(0) saturate(12) hue-rotate(150deg) brightness(0.55);
      opacity: 0.88;
    }
    /* Bande basse */
    92.8% {
      transform: translate(12px, 1px) skewX(-1deg);
      clip-path: inset(72% 0 10% 0);
      filter: sepia(0) saturate(16) hue-rotate(330deg) brightness(2);
      opacity: 1;
    }
    /* Blackout complet */
    93.5% {
      transform: translate(0,0);
      clip-path: none;
      filter: brightness(0);
      opacity: 1;
    }
    /* Flash phosphore intense */
    94.2% {
      transform: translate(0,0);
      clip-path: none;
      filter: brightness(7) saturate(0);
      opacity: 1;
    }
    /* Wobble résiduel gauche */
    94.9% {
      transform: translate(-5px, 0) skewX(-0.6deg);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(0.82);
      opacity: 1;
    }
    /* Micro-correction droite */
    95.6% {
      transform: translate(2px, 0);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.08);
      opacity: 1;
    }
    /* Retour normal */
    96.3%, 100% {
      transform: translate(0,0) skewX(0deg);
      clip-path: none;
      filter: sepia(0.35) saturate(5) hue-rotate(192deg) brightness(1.05);
      opacity: 1;
    }
  }

  /* ── Aberration chromatique CRT ──────────────────────────────────────
     Synchronisé 10s — alternance cyan (hue 150°) et rouge (hue 330°)
     par bande, décalage opposé au logo principal.
  */
  @keyframes tsanga-crt-ghost {
    0%, 79.9%, 85.6%, 89.9%, 96%, 100% {
      transform: translate(0,0);
      opacity: 0;
      clip-path: none;
    }

    /* Burst 1 */
    80% {
      transform: translate(11px, 0);
      opacity: 0.55;
      clip-path: inset(0 0 76% 0);
      filter: brightness(7) saturate(24) hue-rotate(150deg);
    }
    80.8% {
      transform: translate(-11px, 0);
      opacity: 0.45;
      clip-path: inset(24% 0 52% 0);
      filter: brightness(7) saturate(24) hue-rotate(330deg);
    }
    81.6% {
      transform: translate(8px, 2px);
      opacity: 0.5;
      clip-path: inset(48% 0 28% 0);
      filter: brightness(6) saturate(20) hue-rotate(150deg);
    }
    82.4% {
      transform: translate(-8px, -2px);
      opacity: 0.42;
      clip-path: inset(72% 0 6% 0);
      filter: brightness(7) saturate(24) hue-rotate(330deg);
    }
    83.2% { opacity: 0; clip-path: none; }

    /* Burst 2 */
    90% {
      transform: translate(15px, 0);
      opacity: 0.65;
      clip-path: inset(0 0 86% 0);
      filter: brightness(8) saturate(30) hue-rotate(150deg);
    }
    90.7% {
      transform: translate(-15px, 0);
      opacity: 0.55;
      clip-path: inset(14% 0 68% 0);
      filter: brightness(8) saturate(30) hue-rotate(330deg);
    }
    91.4% {
      transform: translate(11px, -3px);
      opacity: 0.6;
      clip-path: inset(32% 0 48% 0);
      filter: brightness(7) saturate(26) hue-rotate(150deg);
    }
    92.1% {
      transform: translate(-9px, 2px);
      opacity: 0.5;
      clip-path: inset(52% 0 28% 0);
      filter: brightness(8) saturate(30) hue-rotate(330deg);
    }
    92.8% {
      transform: translate(11px, 1px);
      opacity: 0.55;
      clip-path: inset(72% 0 10% 0);
      filter: brightness(7) saturate(26) hue-rotate(150deg);
    }
    93.5% { opacity: 0; clip-path: none; }
  }

  /* ── Barre de balayage — ligne de re-sync cathodique ─────────────────
     Cycle 10s linear — glisse de haut en bas lors de chaque burst.
     Simule la ligne de faisceau électronique qui re-balaye l'écran
     quand le signal de synchronisation verticale est perdu.
  */
  @keyframes tsanga-crt-bar {
    0%, 79.9%             { top: 0%; opacity: 0; }
    80%                   { top: 0%; opacity: 0.6; }
    85%                   { top: calc(100% - 6px); opacity: 0.12; }
    85.1%                 { top: 0%; opacity: 0; }
    89.9%                 { top: 0%; opacity: 0; }
    90%                   { top: 0%; opacity: 0.7; }
    96%                   { top: calc(100% - 6px); opacity: 0.05; }
    96.1%, 100%           { top: 0%; opacity: 0; }
  }
`;
