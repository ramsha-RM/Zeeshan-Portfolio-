export default function ProjectHighlights({ project }) {
  const { highlights } = project.details;
  if (!highlights.heading && !highlights.items.length) return null;

  return (
    <section className="pd__block shell">
      <div className="pd__dark" data-reveal>
        {highlights.eyebrow && (
          <span className="pd__script pd__script--inline">{highlights.eyebrow}</span>
        )}
        <h2 className="pd__heading pd__heading--light">{highlights.heading}</h2>

        <div className="pd__points">
          {highlights.items.map((item, i) => (
            <div className="pd__point" key={i}>
              <span className="pd__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
