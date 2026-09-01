import { useEffect, useRef } from 'react';

/** A lerped "View →" disc that follows the pointer while inside the zone. */
export default function useCursorFollower() {
  const zone = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    const z = zone.current, d = dot.current;
    if (!z || !d) return;
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      d.style.display = 'none';
      return;
    }
    let x = 0, y = 0, cx = 0, cy = 0, raf = null, inside = false;
    const loop = () => {
      cx += (x - cx) * 0.16;
      cy += (y - cy) * 0.16;
      d.style.transform =
        'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%) scale(' + (inside ? 1 : 0.4) + ')';
      raf = inside || Math.abs(x - cx) > 0.4 ? requestAnimationFrame(loop) : null;
    };
    const move = (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(loop); };
    const enter = (e) => { inside = true; x = cx = e.clientX; y = cy = e.clientY; d.style.opacity = '1'; if (!raf) raf = requestAnimationFrame(loop); };
    const leave = () => { inside = false; d.style.opacity = '0'; };
    z.addEventListener('pointermove', move);
    z.addEventListener('pointerenter', enter);
    z.addEventListener('pointerleave', leave);
    return () => {
      z.removeEventListener('pointermove', move);
      z.removeEventListener('pointerenter', enter);
      z.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return { zone, dot };
}
