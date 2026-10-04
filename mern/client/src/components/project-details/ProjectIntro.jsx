export default function ProjectIntro({ project }) {
  const { intro, colors, fonts } = project.details;
  const hasCopy = intro.heading || intro.paragraphs.length > 0;
  const hasTiles = colors.length > 0 || fonts.length > 0;

  if (!hasCopy && !intro.image && !hasTiles) return null;

  return (
    <section className="pd__block shell">
      {hasCopy && (
        <div className="pd__intro">
          <div data-reveal="left">
            {intro.eyebrow && <span className="pd__script pd__script--inline">{intro.eyebrow}</span>}
            <h2 className="pd__heading">{intro.heading}</h2>
          </div>
          <div className="pd__copy" data-reveal="right">
            {intro.paragraphs.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </div>
      )}

      {intro.image && (
        <figure className="pd__wide" data-reveal>
          <img src={intro.image} alt={`${project.name} overview`} loading="lazy" />
        </figure>
      )}

      {hasTiles && (
        <div className="pd__tiles">
          <div className="pd__tile" data-reveal="left">
            <h3 className="pd__tileTitle">Colors</h3>
            <div className="pd__swatches">
              {colors.map((c, i) => (
                <div className="pd__swatch" key={i}>
                  <span style={{ background: c.hex }} />
                  <em>{c.name}</em>
                  <small>{c.hex}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="pd__tile" data-reveal="right">
            <h3 className="pd__tileTitle">Fonts</h3>
            <div className="pd__fonts">
              {fonts.map((f, i) => (
                <div className="pd__font" key={i}>
                  <strong>{f.sample || 'Aa'}</strong>
                  <em>{f.name}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
