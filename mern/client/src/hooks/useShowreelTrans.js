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
  
      gsap.fromTo(
        grid,
        {
          y: 180,
        },
        {
          y: -350,
          ease: "none",

          scrollTrigger: {
            trigger: grid,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

   
      if (label) {
        gsap.fromTo(
          label,
          {
            x: 0,
            y: 0,
            rotation: -9,
          },
          {
            x: 60,
            y: -16,
            rotation: 13,
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