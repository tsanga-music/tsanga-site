import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Applique une animation fade+slide GSAP ScrollTrigger à l'élément retourné.
 *
 * @param {object} options
 * @param {number} [options.y=40]        Distance verticale de départ (px)
 * @param {number} [options.duration=0.8] Durée de l'animation (s)
 * @param {string} [options.ease]        Easing GSAP
 * @param {number} [options.delay=0]     Délai avant l'animation (s)
 */
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    /* Respecte prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(
      el,
      { opacity: 0, y: options.y ?? 40 },
      {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.8,
        delay: options.delay ?? 0,
        ease: options.ease ?? 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      anim.kill();
      anim.scrollTrigger?.kill();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
