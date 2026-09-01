import { useEffect, useRef, useState } from 'react';

/** 0 → target over 1.4s, cubic ease-out, starting at `delay` ms. */
export default function useCountUp(target, { delay = 1150, duration = 1400 } = {}) {
  const [n, setN] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(target); return; }
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / duration);
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf.current); };
  }, [target, delay, duration]);

  return n;
}
