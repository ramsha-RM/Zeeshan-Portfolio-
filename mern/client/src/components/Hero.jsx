import { hero } from '../data/site.js';
import portraitAvif from '../assets/hero-cutout.avif';
import portraitWebp from '../assets/hero-cutout.webp';
import useHeadlineFit from '../hooks/useHeadlineFit.js';
import useLoadSequence from '../hooks/useLoadSequence.js';
import useCountUp from '../hooks/useCountUp.js';
import './Hero.css';

function Stat({ value, suffix, label }) {
  const n = useCountUp(value);
  return (
    <div className="hero__stat">
      <div className="hero__statNum">{n}{suffix}</div>
      <div className="hero__statLabel">{label}</div>
    </div>
  );
}

/**
 * Figma "Portfolio" hero: script "Meet the" over a fitted PRODUCT DESIGNER
 * headline that sits BEHIND the portrait (transparent cut-out), stats on the right.
 */
export default function Hero({ heroRef }) {
  const { headline, script } = useHeadlineFit(85, 0.4);
  useLoadSequence();

  return (
    <section ref={heroRef} id="top" className="hero">
      <div className="shell hero__type">
        <div className="hero__script" data-load="script" ref={script}>{hero.script}</div>
        <div className="hero__mask">
          <h1 className="hero__headline" data-load="headline" ref={headline} aria-label={`${hero.headline} — Zeeshan Munawar`}>
            {hero.headline}
          </h1>
        </div>
      </div>

      <div className="hero__photoWrap">
        <picture className="hero__picture">
          <source srcSet={portraitAvif} type="image/avif" />
          <img className="hero__photo" data-load="portrait" src={portraitWebp} width="1800" height="1013" alt={hero.portraitAlt} />
        </picture>
        <div className="hero__overlay">
          <div className="hero__overlayShell">
            <div className="hero__stats" data-load="stats">
              {hero.stats.map((s) => <Stat key={s.label} {...s} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
