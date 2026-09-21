import { useEffect, useRef } from "react";

/** A lerped "View →" disc that follows the pointer while inside the zone. */
export default function useCursorFollower() {
  const zone = useRef(null);
  const dot = useRef(null);

  useEffect(() => {
    const z = zone.current,
      d = dot.current;
    if (!z || !d) return;

    if (
      !matchMedia("(pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      d.style.display = "none";
      return;
    }

    let x = 0,
      y = 0,
      cx = 0,
      cy = 0,
      raf = null,
      inside = false;

    // Higher factor = tighter follow, closer to the actual cursor.
    const LERP = 0.45;

    const loop = () => {
      cx += (x - cx) * LERP;
      cy += (y - cy) * LERP;
      d.style.transform =
        "translate(" + cx + "px," + cy + "px) translate(-50%,-50%) scale(" +
        (inside ? 1 : 0.4) +
        ")";

      if (inside) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };

    // Check the pointer against the zone's live bounding box on every move,
    // instead of relying on pointerenter/pointerleave.
    const move = (e) => {
      const rect = z.getBoundingClientRect();
      const wasInside = inside;
      const nextInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!nextInside) {
        inside = false;
        if (wasInside || raf) {
          d.style.opacity = "0";
          d.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%) scale(0.4)";
          if (raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        }
        return;
      }

      inside = true;
      x = e.clientX;
      y = e.clientY;

      if (!wasInside) {
        // just entered — snap close so it doesn't lag in from far away
        cx = x;
        cy = y;
        d.style.opacity = "1";
      }

      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { zone, dot };
}