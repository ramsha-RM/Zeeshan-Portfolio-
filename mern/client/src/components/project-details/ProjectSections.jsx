export default function ProjectSections({ project }) {
  const { sections } = project.details;
  if (!sections.length) return null;

  return (
    <section className="pd__block shell">
      {sections.map((s, i) => {
        const flip = s.side === 'left' || (s.side !== 'right' && i % 2 === 1);

        return (
          <article className={'pd__row' + (flip ? ' pd__row--flip' : '')} key={i}>
            <div className="pd__rowText" data-reveal={flip ? 'right' : 'left'}>
              {s.eyebrow && <span className="pd__script pd__script--inline">{s.eyebrow}</span>}
              <h2 className="pd__heading">{s.heading}</h2>
              <p>{s.body}</p>
            </div>

            <figure className="pd__rowFigure" data-reveal={flip ? 'left' : 'right'}>
              <div className="pd__plate">
                {s.image && <img src={s.image} alt={s.heading || project.name} loading="lazy" />}
              </div>
              {(s.caption || s.captionRight) && (
                <figcaption>
                  <span>{s.caption}</span>
                  <span>{s.captionRight}</span>
                </figcaption>
              )}
            </figure>
          </article>
        );
      })}
    </section>
  );
}
