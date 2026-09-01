import { useEffect, useState } from 'react';
import { projects as fallback } from '../data/site.js';
import Eyebrow from './ui/Eyebrow.jsx';
import Icon from './ui/Icon.jsx';
import useSplitText from '../hooks/useSplitText.js';
import useCursorFollower from '../hooks/useCursorFollower.js';
import './Projects.css';

export default function Projects() {
  const [items, setItems] = useState(fallback.slice(0, 6));

  const heading = useSplitText();
  const { zone, dot } = useCursorFollower();

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        if (Array.isArray(d) && d.length) {
          setItems(d.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="projects" className="section shell">
      <Eyebrow data-reveal>Our Projects</Eyebrow>

      <h2 className="h2" ref={heading}>
        Recent Case Studies
      </h2>

      <div className="projects" ref={zone}>
        {items.map((p, i) => (
          <article
            className="project"
            key={p.slug}
            data-reveal
            style={{
              '--d': `${(i % 4) * 0.08}s`,
            }}
          >
            <a
              className="project__plate"
              href={`#${p.slug}`}
              aria-label={p.name}
            >
              {p.image && (
                <img
                  src={p.image}
                  alt={`${p.name} case study`}
                  loading="lazy"
                />
              )}
            </a>

            <div className="project__meta">
              <span>{p.name}</span>

              <span className="project__tags">
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div
        className="projects__cursor"
        ref={dot}
        aria-hidden="true"
      >
        View
        <Icon
          name="arrow"
          size={12}
          stroke="#f7f7f6"
          width={2}
        />
      </div>
    </section>
  );
}