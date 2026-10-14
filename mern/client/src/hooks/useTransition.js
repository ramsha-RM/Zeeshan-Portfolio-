import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useTransition(heroRef, showreelRef) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const showreel = showreelRef.current;

    if (!hero || !showreel) return;

    let ctx = null;

    const run = () => {
      ctx = gsap.context(() => {
        gsap.fromTo(
          showreel,
          {
            yPercent: 8,
            scale: 0.985,
          },
          {
            yPercent: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: showreel,
              start: "top bottom",
              end: "top top",
              scrub: 0.8,
            },
          }
        );
      }, showreel);
    };

    const rafId = requestAnimationFrame(run);
  
    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, [heroRef, showreelRef]);
}
