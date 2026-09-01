import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useProjectsAnimation() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const cards = section.querySelectorAll(".project");

    if (cards.length < 3) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        cards[0],
        {
          x: -360,
          y: 35,
          rotation: -8,
          scale: 0.9,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        cards[1],
        {
          x: 0,
          y: -10,
          rotation: 0,
          scale: 1,
          ease: "power3.out",
        },
        0
      );

      tl.to(
        cards[2],
        {
          x: 360,
          y: 35,
          rotation: 8,
          scale: 0.9,
          ease: "power3.out",
        },
        0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return sectionRef;
}