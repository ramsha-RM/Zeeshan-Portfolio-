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

export default function useFlyIn({ stagger = 0.14, offset = 0 } = {}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const container = ref.current;

    if (!container) return;

    const chips = [...container.querySelectorAll(".chip")];

    if (!chips.length) return;

    let observer;

    const ctx = gsap.context(() => {
      const right =
        container.classList.contains("caps__col--right");

      const startPositions = chips.map((chip, index) => {
        const direction = right ? 1 : -1;

        return {
          x: direction * [180, 240, 150][index % 3],
          y: [-80, 60, -45][index % 3],
          rotation: direction * [-12, 9, -7][index % 3],
        };
      });

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(chips, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
        return;
      }

      chips.forEach((chip, index) => {
        gsap.set(chip, { ...startPositions[index], scale: 0.9, opacity: 0 });
      });

      const play = () => {
        chips.forEach((chip, index) => {
          gsap.to(chip, {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            delay: offset + index * stagger,
            duration: 0.8,
            ease: "power3.out",
          });
        });
      };

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          play();
          observer.disconnect();
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );

      observer.observe(container);

      return () => observer.disconnect();
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
      observer?.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return ref;
}