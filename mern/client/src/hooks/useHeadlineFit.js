import { useEffect, useRef } from "react";

/**
 * Sizes the hero headline so it fills `fill`% of the content column at every
 * viewport width (never wraps). The script line above it is `scriptRatio` × that
 * size. The size is also published as `--hero-fs` on the section, so CSS can
 * scale the letter mask and the portrait overlap with it.
 */
export default function useHeadlineFit(fill = 85, scriptRatio = 0.4) {
  const headline = useRef(null);
  const script = useRef(null);

  useEffect(() => {
    const fit = () => {
      const h = headline.current;
      if (!h) return;
      const host = h.closest(".shell");
      const cs = getComputedStyle(host);
      const avail =
        host.clientWidth -
        parseFloat(cs.paddingLeft) -
        parseFloat(cs.paddingRight);
      const hs = getComputedStyle(h);
      const probe = document.createElement("span");
      probe.textContent = h.textContent;
      probe.style.cssText =
        "position:fixed;left:-9999px;top:0;visibility:hidden;white-space:nowrap;" +
        "text-transform:uppercase;letter-spacing:0;font-size:200px;" +
        `font-family:${hs.fontFamily};font-weight:${hs.fontWeight}`;
      document.body.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      probe.remove();
      if (!w || !avail) return;
      const size = 200 * ((avail * (fill / 100)) / w);
      h.style.fontSize = size.toFixed(2) + "px";
      h.closest("section")?.style.setProperty("--hero-fs", size.toFixed(2) + "px");
      if (script.current)
        script.current.style.fontSize = Math.max(size * scriptRatio, 22).toFixed(2) + "px"; // stays legible on phones
    };

    fit();
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener?.("loadingdone", fit);
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(fit, 120);
    };
    addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      removeEventListener("resize", onResize);
      document.fonts?.removeEventListener?.("loadingdone", fit);
    };
  }, [fill, scriptRatio]);

  return { headline, script };
}
