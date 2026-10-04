export default function ProjectHero({ project }) {
  const d = project.details;
  const meta = [
    ['Role', d.role],
    ['Client', d.client],
    ['Discipline', d.discipline],
    ['Year', d.year]
  ].filter(([, value]) => value);

  return (
    <section className="pd__hero shell">
      <div className="pd__titleWrap" data-reveal>
        <span className="pd__script">{d.eyebrow}</span>
        <h1 className="pd__title">{d.title}</h1>
      </div>

      {meta.length > 0 && (
        <dl className="pd__meta" data-reveal>
          {meta.map(([label, value]) => (
            <div className="pd__metaItem" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <figure className="pd__heroFigure" data-reveal>
        {d.heroImage && <img src={d.heroImage} alt={`${project.name} case study cover`} />}
        {d.heroCaption && <figcaption className="pd__heroCaption">{d.heroCaption}</figcaption>}
        {d.heroLabel && <span className="pd__heroLabel">{d.heroLabel}</span>}
      </figure>
    </section>
  );
}
