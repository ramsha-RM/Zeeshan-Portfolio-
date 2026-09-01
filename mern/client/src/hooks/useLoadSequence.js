import { useEffect } from 'react';

/** Cumulative hero entrance. Adds .is-ready to <body>; the moves live in animations.css. */
const DELAYS = { script: '0.15s', headline: '0.34s', portrait: '0.6s', stats: '0.95s' };

export default function useLoadSequence() {
  useEffect(() => {
    document.querySelectorAll('[data-load]').forEach((el) => {
      el.style.setProperty('--d', DELAYS[el.dataset.load] || '0s');
    });
    const go = () => requestAnimationFrame(() => document.body.classList.add('is-ready'));
    if (document.readyState === 'complete') go();
    else addEventListener('load', go, { once: true });
  }, []);
}
