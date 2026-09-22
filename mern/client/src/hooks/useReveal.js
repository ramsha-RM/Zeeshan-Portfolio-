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

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'));

    // Allow manual motion testing even when reduced motion is enabled.
    const params = new URLSearchParams(window.location.search);
    let forceMotion = params.get('motion') === 'on';

    try {
      forceMotion = forceMotion || localStorage.getItem('forceMotion') === '1';
    } catch {
      // Ignore storage access issues in stricter browser contexts.
    }

    const prefersReduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !forceMotion;

    if (prefersReduced) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }

    // Reveal elements already in the initial viewport before observing.
    const revealIfVisible = (el) => {
      if (!el || el.classList.contains('is-in')) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) el.classList.add('is-in');
    };

    const checkpoint = () => {
      nodes.forEach((node) => revealIfVisible(node));
    };

    // Some browsers or older environments do not support IntersectionObserver.
    // In that case, fall back to a simple scroll/resize visibility check.
    if (!('IntersectionObserver' in window)) {
      checkpoint();

      const onScroll = () => checkpoint();
      const onResize = () => checkpoint();

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });

      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }

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
