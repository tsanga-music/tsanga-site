import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

/* ── Easings personnalisés (inspirés du projet GSAP/Lenis de référence) ──
   Créés une seule fois au chargement du module.
────────────────────────────────────────────────────────────────────────── */
try {
  CustomEase.create('verticalEase', '0.4, 0, 0.2, 1');
  CustomEase.create('blurEase',     '0.65, 0, 0.35, 1');
  CustomEase.create('svgEase',      '0.25, 0.1, 0.25, 1');
} catch (_) {
  // ignore si déjà créés (re-render strictMode)
}

/**
 * Applique une animation fade+slide+blur GSAP ScrollTrigger à l'élément retourné.
 *
 * @param {object} options
 * @param {number} [options.y=40]        Distance verticale de départ (px)
 * @param {number} [options.blur=0]      Flou de départ en px (0 = pas de blur)
 * @param {number} [options.duration=0.8] Durée de l'animation (s)
 * @param {string} [options.ease]        Easing GSAP (défaut: 'blurEase')
 * @param {number} [options.delay=0]     Délai avant l'animation (s)
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    /* Respecte prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    const blur = options.blur ?? 0;
    const ease = options.ease ?? (blur > 0 ? 'blurEase' : 'power2.out');

    const fromVars = { opacity: 0, y: options.y ?? 60 };
    const toVars   = {
      opacity: 1,
      y: 0,
      duration: options.duration ?? 2.8,
      delay:    options.delay    ?? 0,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    };

    /* Blur optionnel */
    if (blur > 0) {
      fromVars.filter = `blur(${blur}px)`;
      toVars.filter   = 'blur(0px)';
    }

    const anim = gsap.fromTo(el, fromVars, toVars);

    return () => {
      anim.kill();
      anim.scrollTrigger?.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
