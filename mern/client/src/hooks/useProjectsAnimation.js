import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useProjectsAnimation(deps = []) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = gsap.utils.toArray(section.querySelectorAll('.project'));
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      
      const params = new URLSearchParams(window.location.search);
      const forceMotion =
        params.get('motion') === 'on' ||
        localStorage.getItem('forceMotion') === '1';

      
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !forceMotion) {
        gsap.set(cards, { x: 0, y: 0, opacity: 1 });
        return;
      }

      const compact = window.matchMedia('(max-width: 640px)').matches;

      gsap.set(cards, {
        x: (index) => (index % 2 === 0 ? -180 : 180) * (compact ? 0.52 : 1),
        y: (index) => {
          const row = Math.floor(index / 2);
          return (compact ? 42 : 16) + row * (compact ? 14 : 6);
        },
        opacity: 0,
        force3D: true,
      });

      gsap.to(cards, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: compact ? 1.05 : 0.9,
        ease: 'power3.out',
        stagger: compact ? 0.22 : 0.14,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });
    }, section);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, deps);

  return sectionRef;
}