// import { useEffect, useRef } from 'react';

// export default function useFlyIn({ stagger = 0.14, offset = 0 } = {}) {
//   const ref = useRef(null);

//   useEffect(() => {
//     const wrap = ref.current;
//     if (!wrap) return;
//     const chips = [...wrap.children];
//     if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
//       chips.forEach((c) => c.classList.add('is-floating'));
//       return;
//     }
//     chips.forEach((c, i) => c.style.setProperty('--d', offset + i * stagger + 's'));

//     const io = new IntersectionObserver(
//       (entries, ob) =>
//         entries.forEach((e) => {
//           if (!e.isIntersecting) return;
//           chips.forEach((c, i) => {
//             c.classList.add('is-in');
//             setTimeout(() => {
//               c.removeAttribute('data-fly');
//               c.classList.add('is-floating');
//             }, (offset + i * stagger + 1.4) * 1000);
//           });
//           ob.disconnect();
//         }),
//       { threshold: 0.25 }
//     );
//     io.observe(wrap);
//     return () => io.disconnect();
//   }, [stagger, offset]);

//   return ref;
// }
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useFlyIn() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const container = ref.current;

    if (!container) return;

    const chips = [...container.querySelectorAll(".chip")];

    if (!chips.length) return;

    const ctx = gsap.context(() => {
      const right =
        container.classList.contains("caps__col--right");

      chips.forEach((chip, index) => {
        const direction = right ? 1 : -1;

        const startX =
          direction * [180, 240, 150][index % 3];

        const startY =
          [-80, 60, -45][index % 3];

        const startRotation =
          direction * [-12, 9, -7][index % 3];

        const endX =
          direction * [18, -12, 10][index % 3];

        const endY =
          [8, -12, 6][index % 3];

        const endRotation =
          direction * [3, -2, 2][index % 3];

        gsap.fromTo(
          chip,
          {
            x: startX,
            y: startY,
            rotation: startRotation,
            scale: 0.9,
            opacity: 0,
          },
          {
            x: endX,
            y: endY,
            rotation: endRotation,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top 90%",
              end: "top 35%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, container);

    const cleanups = chips.map((chip) => {
      let dragging = false;
      let pointerId = null;

      let startX = 0;
      let startY = 0;

      let originalX = 0;
      let originalY = 0;

      const down = (event) => {
        if (event.button !== 0) return;

        dragging = true;
        pointerId = event.pointerId;

        startX = event.clientX;
        startY = event.clientY;

        originalX = Number(gsap.getProperty(chip, "x")) || 0;
        originalY = Number(gsap.getProperty(chip, "y")) || 0;

        chip.setPointerCapture(pointerId);
        chip.classList.add("is-dragging");
      };

      const move = (event) => {
        if (!dragging || event.pointerId !== pointerId) return;

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        gsap.set(chip, {
          x: originalX + dx,
          y: originalY + dy,
        });
      };

      const up = (event) => {
        if (!dragging || event.pointerId !== pointerId) return;

        dragging = false;

        if (chip.hasPointerCapture(pointerId)) {
          chip.releasePointerCapture(pointerId);
        }

        chip.classList.remove("is-dragging");
      };

      chip.addEventListener("pointerdown", down);
      chip.addEventListener("pointermove", move);
      chip.addEventListener("pointerup", up);
      chip.addEventListener("pointercancel", up);

      return () => {
        chip.removeEventListener("pointerdown", down);
        chip.removeEventListener("pointermove", move);
        chip.removeEventListener("pointerup", up);
        chip.removeEventListener("pointercancel", up);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return ref;
}