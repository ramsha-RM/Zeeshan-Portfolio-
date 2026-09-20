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

    const prefs = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const forceMotion = params?.get("motion") === "on" || localStorage.getItem("forceMotion") === "1";

    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray(grid.querySelectorAll(".reel__tile"));

      // Respect the OS/browser motion preference unless explicitly forced on
      // for debugging or QA testing.
      if (prefs?.matches && !forceMotion) {
        if (tiles.length) gsap.set(tiles, { y: 0 });
        if (label) gsap.set(label, { x: 0, y: 0, rotation: 0, opacity: 1 });
        return;
      }

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