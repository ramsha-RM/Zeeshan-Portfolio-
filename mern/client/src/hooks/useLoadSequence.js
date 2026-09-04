// import { useEffect } from 'react';

// /** Cumulative hero entrance. Adds .is-ready to <body>; the moves live in animations.css. */
// const DELAYS = { script: '0.15s', headline: '0.34s', portrait: '0.6s', stats: '0.95s' };

// export default function useLoadSequence() {
//   useEffect(() => {
//     document.querySelectorAll('[data-load]').forEach((el) => {
//       el.style.setProperty('--d', DELAYS[el.dataset.load] || '0s');
//     });
//     const go = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
//     if (document.readyState === 'complete') go();
//     else addEventListener('load', go, { once: true });
//   }, []);
// }


import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Cumulative hero entrance. Adds .is-ready to <body>; the moves live in animations.css. */
const DELAYS = { script: '0.15s', headline: '0.34s', portrait: '0.6s', stats: '0.95s' };

export default function useLoadSequence() {
  useEffect(() => {
    document.querySelectorAll('[data-load]').forEach((el) => {
      el.style.setProperty('--d', DELAYS[el.dataset.load] || '0s');
    });

    const go = () => {
      requestAnimationFrame(() => {
        document.body.classList.add('is-ready');

        // Re-measure ScrollTrigger positions once every image has actually
        // finished loading, so trigger points are calculated against the
        // page's final, settled height (fixes the double-scrollbar-on-fresh-load issue).
        const imgs = Array.from(document.images);
        const pending = imgs.filter((img) => !img.complete);

        if (pending.length === 0) {
          ScrollTrigger.refresh();
        } else {
          let remaining = pending.length;
          const done = () => {
            remaining -= 1;
            if (remaining === 0) ScrollTrigger.refresh();
          };
          pending.forEach((img) => {
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
          });
        }
      });
    };

    if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  }, []);
}