import { useEffect, useRef } from 'react';

/**
 * Measures the headline on an off-screen probe and sets font-size so the line
 * fills `fill`% of the content column on desktop (99.5% under 900px). Never wraps.
 * The script line above it stays at 60% of the resolved size.
 */
export default function useHeadlineFit(fill = 78) {
  const headline = useRef(null);
  const script = useRef(null);

  useEffect(() => {
    const fit = () => {
      const h = headline.current;
      if (!h) return;
      const host = h.closest('.shell');
      const cs = getComputedStyle(host);
      const avail = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const probe = document.createElement('span');
      probe.textContent = h.textContent;
      probe.style.cssText =
        'position:fixed;left:-9999px;top:0;visibility:hidden;white-space:nowrap;' +
        'text-transform:uppercase;letter-spacing:-.005em;font-size:200px;font-family:' +
        getComputedStyle(h).fontFamily;
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      if (!w || !avail) return;
      const size = 200 * ((avail * (innerWidth < 900 ? 0.995 : fill / 100)) / w);
      h.style.fontSize = size.toFixed(2) + 'px';
      if (script.current) script.current.style.fontSize = (size * 0.6).toFixed(2) + 'px';
    };

    fit();
    if (document.fonts) document.fonts.ready.then(fit);
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(fit, 120); };
    addEventListener('resize', onResize);
    return () => { clearTimeout(t); removeEventListener('resize', onResize); };
  }, [fill]);

  return { headline, script };
}
