import React from 'react';
import { EditableImage, EditableText } from './InlineEdit.jsx';

export default function ProjectHero({ project, editable = false, update }) {
  const d = project.details;
  const meta = [
    ['Role', 'details.role', d.role],
    ['Client', 'details.client', d.client],
    ['Discipline', 'details.discipline', d.discipline],
    ['Year', 'details.year', d.year]
  ].filter(([, , value]) => editable || value);
  const hasImage = Boolean(d.heroImage);
  const Text = ({ path, value, as = 'span', ...props }) => {
    if (editable) return <EditableText as={as} value={value} onChange={(next) => update(path, next)} {...props} />;
    return React.createElement(as, { className: props.className }, value);
  };

  return (
    <section className="pd__hero shell">
      <div className="pd__titleWrap" data-reveal>
        <span className="pd__script">Selected Project</span>
        <h1 className="pd__title">Project Case Study</h1>
      </div>

      {meta.length > 0 && (editable || hasImage) && (
        <dl className="pd__meta" data-reveal>
          {meta.map(([label, path, value]) => {
            return (
            <div className="pd__metaItem" key={label}>
              <dt>{label}</dt>
              <dd>
                <Text path={path} value={value} as="span" placeholder={`Add ${label.toLowerCase()}`} />
              </dd>
            </div>
            );
          })}
        </dl>
      )}

      <figure className={'pd__heroFigure' + (!hasImage ? ' pd__heroFigure--blank' : '')} data-reveal>
        {editable ? (
          <>
            <EditableImage
              src={d.heroImage}
              alt={`${project.name} case study cover`}
              onChange={(value) => update('details.heroImage', value)}
              className="pd__heroImageEdit"
              emptyLabel="Add a case-study cover image"
            />
            {(d.heroCaption || editable) && <figcaption className="pd__heroCaption">{editable
              ? <Text path="details.heroCaption" value={d.heroCaption} placeholder="Image caption" />
              : d.heroCaption}</figcaption>}
            {(d.heroLabel || editable) && <Text path="details.heroLabel" value={d.heroLabel} as="span" className="pd__heroLabel" placeholder="Project label" />}
          </>
        ) : hasImage ? (
          <>
            <img src={d.heroImage} alt={`${project.name} case study cover`} />
            {d.heroCaption && <figcaption className="pd__heroCaption">{d.heroCaption}</figcaption>}
            {d.heroLabel && <span className="pd__heroLabel">{d.heroLabel}</span>}
          </>
        ) : (
          <>
            <div className="pd__heroMockup" aria-hidden="true">
              <span className="pd__heroMockupLine" />
              <span className="pd__heroMockupLine pd__heroMockupLine--right" />
            </div>
            {d.heroCaption && <figcaption className="pd__heroCaption">{d.heroCaption}</figcaption>}
            {d.heroLabel && <span className="pd__heroLabel">{d.heroLabel}</span>}
          </>
        )}
      </figure>
    </section>
  );
}
