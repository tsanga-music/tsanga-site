// src/components/WaterBackground.jsx
// Fond éthéré — turbulence SVG (inspiré etheral-shadow) + ripples canvas souris
//
// Couche 1 : SVG feTurbulence + feColorMatrix hueRotate + feDisplacementMap
//            → blobs de couleur qui se déforment de façon organique
// Couche 2 : Canvas transparent par-dessus → ripples elliptiques + glow curseur
//            Le déplacement SVG augmente dynamiquement avec la vélocité souris

import { useRef, useEffect, useId } from 'react';
import { animate, useMotionValue } from 'framer-motion';


export default function WaterBackground() {
  const canvasRef    = useRef(null);
  const displaceRef1 = useRef(null);  // feDisplacementMap principal
  const displaceRef2 = useRef(null);  // feDisplacementMap secondaire
  const feColorRef   = useRef(null);  // feColorMatrix hueRotate

  /* ID stable, unique — évite les collisions entre instances SVG */
  const rawId    = useId();
  const filterId = `ethbg-${rawId.replace(/:/g, '')}`;

  const hueValue = useMotionValue(0);

  /* ── Animation hueRotate (etheral-shadow pattern) ────────────────
     Cycle 28s : slow, atmospheric — palette bleue→violette→rouge TSANGA  */
  useEffect(() => {
    const ctrl = animate(hueValue, 360, {
      duration: 28,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
      onUpdate: (v) => {
        if (feColorRef.current) {
          feColorRef.current.setAttribute('values', String(v));
        }
      },
    });
    return () => ctrl.stop();
  }, [hueValue]);

  /* ── Canvas : ripples souris + interaction SVG ────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    /* Scale SVG en cours et cible — eased dans la boucle draw() */
    let currentScale = 55;
    let targetScale  = 55;
    const BASE_SCALE = 55;
    const MAX_SCALE  = 105;

    const mouse  = { x: -9999, y: -9999 };
    const vel    = { x: 0, y: 0 };
    const ripples = [];

    /* ── Redimensionnement ──────────────────────────────────────── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── Souris ─────────────────────────────────────────────────── */
    const onMouseMove = (e) => {
      vel.x = e.clientX - mouse.x;
      vel.y = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);

      if (speed > 2) {
        ripples.push({
          x: mouse.x, y: mouse.y,
          r: 0,
          maxR: 80 + speed * 3,
          alpha: Math.min(0.55, speed * 0.022),
        });
        if (ripples.length > 18) ripples.shift();

        /* Plus la souris va vite → plus la turbulence se déforme */
        targetScale = Math.min(MAX_SCALE, BASE_SCALE + speed * 2.2);
      }
    };

    /* ── Tactile ────────────────────────────────────────────────── */
    const onTouchMove = (e) => {
      const touch = e.touches[0];
      vel.x = touch.clientX - mouse.x;
      vel.y = touch.clientY - mouse.y;
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);
      if (speed > 1) {
        ripples.push({
          x: mouse.x, y: mouse.y,
          r: 0, maxR: 100 + speed * 4, alpha: 0.35,
        });
        if (ripples.length > 12) ripples.shift();
        targetScale = Math.min(MAX_SCALE, BASE_SCALE + speed * 1.6);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    /* ── Boucle de rendu ────────────────────────────────────────── */
    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* Ease du scale SVG → turbulence réagit au curseur */
      currentScale += (targetScale - currentScale) * 0.07;
      targetScale  += (BASE_SCALE - targetScale) * 0.035; // retour au repos
      const sc = Math.round(currentScale);
      if (displaceRef1.current) displaceRef1.current.setAttribute('scale', String(sc));
      if (displaceRef2.current) displaceRef2.current.setAttribute('scale', String(Math.round(sc * 0.45)));

      /* ── Ripples elliptiques ─────────────────────────────────── */
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp   = ripples[i];
        rp.r      += 2.3;
        const life  = rp.r / rp.maxR;
        const alpha = rp.alpha * (1 - life) * (1 - life);

        if (alpha > 0.004) {
          /* Anneau principal — bleu #4a8fff */
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.36, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(74,143,255,${alpha.toFixed(3)})`;
          ctx.lineWidth   = 1.3 * (1 - life * 0.65);
          ctx.stroke();

          /* Anneau intérieur — violet */
          if (rp.r > 15) {
            ctx.beginPath();
            ctx.ellipse(rp.x, rp.y, rp.r * 0.56, rp.r * 0.56 * 0.36, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(160,75,255,${(alpha * 0.32).toFixed(3)})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }

          /* Éclat de vitesse — troisième anneau rouge */
          if (rp.r > 30 && rp.alpha > 0.3) {
            ctx.beginPath();
            ctx.ellipse(rp.x, rp.y, rp.r * 0.28, rp.r * 0.28 * 0.36, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,40,90,${(alpha * 0.18).toFixed(3)})`;
            ctx.lineWidth   = 0.6;
            ctx.stroke();
          }
        } else {
          ripples.splice(i, 1);
        }
      }

      /* ── Halo du curseur ────────────────────────────────────── */
      if (mouse.x > 0) {
        const rg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 115);
        rg.addColorStop(0,   'rgba(74,143,255,0.065)');
        rg.addColorStop(0.4, 'rgba(120,55,200,0.022)');
        rg.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, W, H);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: '#04040a',
      }}
    >
      {/* ── Définitions du filtre SVG (invisibles) ────────────────
          Doit précéder la div qui l'utilise dans le DOM             */}
      <svg
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        <defs>
          <filter
            id={filterId}
            x="-25%" y="-25%"
            width="150%" height="150%"
            colorInterpolationFilters="sRGB"
          >
            {/* Bruit fractal de base */}
            <feTurbulence
              result="undulation"
              type="turbulence"
              numOctaves="3"
              baseFrequency="0.0007,0.0024"
              seed="4"
            />

            {/* Rotation de teinte animée — cycle 28s via framer-motion */}
            <feColorMatrix
              ref={feColorRef}
              in="undulation"
              type="hueRotate"
              values="0"
              result="hueRotated"
            />

            {/* Amplification — augmente le contraste du bruit → déformation plus marquée */}
            <feColorMatrix
              in="hueRotated"
              type="matrix"
              values="4 0 0 0 0.8  4 0 0 0 0.8  4 0 0 0 0.8  1 0 0 0 0"
              result="amplified"
            />

            {/* Première distorsion — déplace les blobs de couleur */}
            <feDisplacementMap
              ref={displaceRef1}
              in="SourceGraphic"
              in2="amplified"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />

            {/* Seconde distorsion — passe sur le bruit brut pour l'ondulation fine */}
            <feDisplacementMap
              ref={displaceRef2}
              in="displaced"
              in2="undulation"
              scale="25"
              xChannelSelector="G"
              yChannelSelector="B"
              result="output"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Couche turbulence : blobs de couleur déformés ────────────
          inset: -90 → masque les artefacts de bord du feDisplacementMap
          blur(4px)  → adoucit les contours pour l'effet éthéré         */}
      <div
        style={{
          position: 'absolute',
          inset: -90,
          filter: `url(#${filterId}) blur(4px)`,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(ellipse 62% 52% at 22% 42%, rgba(74,143,255,0.24) 0%, transparent 65%),
              radial-gradient(ellipse 52% 62% at 78% 58%, rgba(255,40,90,0.15) 0%, transparent 65%),
              radial-gradient(ellipse 80% 42% at 50% 12%, rgba(140,60,255,0.11) 0%, transparent 62%),
              radial-gradient(ellipse 38% 68% at 12% 82%, rgba(40,110,255,0.13) 0%, transparent 58%),
              radial-gradient(ellipse 58% 38% at 88% 88%, rgba(200,35,75,0.09)  0%, transparent 58%),
              radial-gradient(ellipse 45% 45% at 60% 35%, rgba(80,40,180,0.07)  0%, transparent 55%),
              #04040a
            `,
          }}
        />
      </div>

      {/* ── Canvas : ripples + glow curseur (interaction souris conservée) */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
