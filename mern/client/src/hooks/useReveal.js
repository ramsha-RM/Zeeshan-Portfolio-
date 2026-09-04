import { useLayoutEffect } from 'react';

/**
 * useReveal - Custom Hook for cross-screen scroll animations.
 * @param {Array} dependencies - Layout state that should retrigger calculations.
 */
export default function useReveal(dependencies = []) {
  useLayoutEffect(() => {
    // Automatically flag sections for animation.
    const sectionRoots = document.querySelectorAll(
      'main > section, footer, .section, .contact'
    );
    sectionRoots.forEach((el) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
      }
    });

    const nodes = document.querySelectorAll('[data-reveal]');

    // Allow manual motion testing even when reduced motion is enabled.
    const params = new URLSearchParams(window.location.search);
    const forceMotion =
      params.get('motion') === 'on' ||
      localStorage.getItem('forceMotion') === '1';

    const prefersReduced =
      matchMedia('(prefers-reduced-motion: reduce)').matches && !forceMotion;

    if (prefersReduced) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }

    // Reveal elements already in the initial viewport before observing.
    const revealIfVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) el.classList.add('is-in');
    };

    const io = new IntersectionObserver(
      (entries, observer) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }),
      {
        threshold: 0.01,
        rootMargin: '0px 0px 80px 0px',
      }
    );

    nodes.forEach((node) => {
      revealIfVisible(node);
      if (!node.classList.contains('is-in')) {
        io.observe(node);
      }
    });

    return () => io.disconnect();
  }, dependencies);
}
