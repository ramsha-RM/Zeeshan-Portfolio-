// import { useLayoutEffect } from "react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function useShowreelTrans(gridRef, labelRef) {
//   useLayoutEffect(() => {
//     const grid = gridRef.current;
//     const label = labelRef?.current;

//     if (!grid) return;

//     const ctx = gsap.context(() => {
  
//       gsap.fromTo(
//         grid,
//         {
//           y: 48,
//         },
//         {
//           y: -48,
//           ease: "none",

//           scrollTrigger: {
//             trigger: grid,
//             start: "top bottom",
//             end: "bottom top",
//             scrub: 0.8,
//           },
//         }
//       );

   
//       if (label) {
//         gsap.fromTo(
//           label,
//           {
//             x: 0,
//             y: 0,
//             rotation: -9,
//           },
//           {
//             x: 60,
//             y: -16,
//             rotation: 13,
//             ease: "sine.inOut",

//             scrollTrigger: {
//               trigger: grid,
//               start: "top bottom",
//               end: "bottom top",
//               scrub: 0.7,
//             },
//           }
//         );
//       }
//     }, grid);

//     return () => ctx.revert();
//   }, [gridRef, labelRef]);
// }
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useShowreelTrans(gridRef, labelRef) {
  useLayoutEffect(() => {
    const grid = gridRef.current;
    const label = labelRef?.current;

    if (!grid) return;

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray(grid.querySelectorAll(".reel__tile"));

      // Reduced motion — skip parallax entirely
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (tiles.length) gsap.set(tiles, { y: 0 });
        if (label) gsap.set(label, { x: 0, y: 0, rotation: 0 });
        return;
      }

      // Each row drifts upward at its own rate — tiles within the same
      // row always share the same distance, so left/right stay perfectly
      // aligned. The first row travels furthest, so it visibly tucks
      // away together as the section scrolls; later rows travel
      // progressively less.
      tiles.forEach((tile, i) => {
        const row = Math.floor(i / 2);
        const distance = row === 0 ? 140 : 70 + row * 26;

        gsap.fromTo(
          tile,
          { y: distance },
          {
            y: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: grid,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      });

      // Label sweeps wider and rotates more, so the motion reads clearly
      if (label) {
        gsap.fromTo(
          label,
          {
            x: -12,
            y: 14,
            rotation: -14,
            opacity: 0.7,
          },
          {
            x: 48,
            y: -24,
            rotation: 4,
            opacity: 1,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: grid,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          }
        );
      }
    }, grid);

    return () => ctx.revert();
  }, [gridRef, labelRef]);
}