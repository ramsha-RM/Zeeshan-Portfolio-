import { useEffect, useRef } from 'react';

/** Portrait drifts with scroll; skipped past 1.3 viewports and on reduced motion. */
export default function useParallax(strength = 0.09) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ticking = false;
    const run = () => {
      ticking = false;
      const y = scrollY;
      if (y > innerHeight * 1.3) return;
      el.style.transform =
        'translateX(-50%) translateY(' + (y * strength).toFixed(2) + 'px) scale(' + (1 + y * 0.00008).toFixed(4) + ')';
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    const t = setTimeout(() => addEventListener('scroll', onScroll, { passive: true }), 2200);
    return () => { clearTimeout(t); removeEventListener('scroll', onScroll); };
  }, [strength]);

  return ref;
}
