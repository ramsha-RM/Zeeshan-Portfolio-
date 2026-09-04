import { useEffect, useRef } from 'react';

/** Pulls the element toward the cursor. Fine pointers only. */
export default function useMagnetic(strength = 0.26) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;
    let active = false;

    const loop = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate(${currentX.toFixed(2)}px,${currentY.toFixed(2)}px)`;
      if (active || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      targetX = (e.clientX - (r.left + r.width / 2)) * strength;
      targetY = (e.clientY - (r.top + r.height / 2)) * strength;
      active = true;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const reset = () => {
      active = false;
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
