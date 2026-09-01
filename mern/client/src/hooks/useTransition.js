import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useTransition(heroRef, showreelRef) {
  useLayoutEffect(() => {
    const hero = heroRef.current;
    const showreel = showreelRef.current;

    if (!hero || !showreel) return;

    const ctx = gsap.context(() => {
      // HERO moves upward as the next section enters
      gsap.to(hero, {
        yPercent: -12,
        scale: 0.98,
        ease: "none",

        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // SHOWREEL enters from below
      gsap.fromTo(
        showreel,
        {
          yPercent: 18,
          scale: 0.94,
        },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",

          scrollTrigger: {
            trigger: showreel,
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [heroRef, showreelRef]);
}