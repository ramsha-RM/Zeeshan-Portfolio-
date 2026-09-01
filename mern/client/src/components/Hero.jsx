import { hero } from '../data/site.js';
import portrait from '../assets/hero-portrait.png';
import useHeadlineFit from '../hooks/useHeadlineFit.js';
import useLoadSequence from '../hooks/useLoadSequence.js';
import useParallax from '../hooks/useParallax.js';
import useCountUp from '../hooks/useCountUp.js';
import { useRef } from 'react';
import '../hooks/useTransition.js'; 
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

export default function Hero({ heroRef }) {
  const { headline, script } = useHeadlineFit(78);
  const img = useParallax(0.09);
  useLoadSequence();

  return (
    <section ref={heroRef} id="top" className="hero">
      <div className="shell hero__type">
        <div className="hero__script" data-load="script" ref={script}>{hero.script}</div>
        <div className="hero__mask">
          <h1 className="hero__headline" data-load="headline" ref={headline}>{hero.headline}</h1>
        </div>
      </div>

      <div className="hero__photoWrap">
        <img className="hero__photo" data-load="portrait" ref={img} src={portrait} alt={hero.portraitAlt} />
        <div className="hero__overlay">
          <div className="shell hero__overlayShell">
            <div className="hero__stats" data-load="stats">
              {hero.stats.map((s) => <Stat key={s.label} {...s} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
