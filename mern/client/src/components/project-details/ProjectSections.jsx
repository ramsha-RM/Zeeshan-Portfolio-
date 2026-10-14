import React from 'react';
import { EditableImage, EditableText, RemoveButton } from './InlineEdit.jsx';

export default function ProjectSections({ project, editable = false, update, add, remove }) {
  const { sections } = project.details;
  if (!sections.length && !editable) return null;

  return (
    <section className="pd__block shell">
      {sections.map((s, i) => {
        const flip = s.side === 'left' || (s.side !== 'right' && i % 2 === 1);
        const text = (path, value, as, props = {}) => {
          if (editable) return <EditableText as={as} value={value} onChange={(next) => update(path, next)} {...props} />;
          const { placeholder: _placeholder, multiline: _multiline, ...htmlProps } = props;
          return React.createElement(as, htmlProps, value);
        };

        return (
          <article className={'pd__row' + (editable ? ' pd__editableBlock' : '') + (flip ? ' pd__row--flip' : '')} key={i}>
            <div className="pd__rowText" data-reveal={flip ? 'right' : 'left'}>
              {(s.eyebrow || editable) && text(`details.sections.${i}.eyebrow`, s.eyebrow, 'span', { className: 'pd__script pd__script--inline', placeholder: 'Section eyebrow' })}
              {text(`details.sections.${i}.heading`, s.heading, 'h2', { className: 'pd__heading', placeholder: 'Section heading' })}
              {text(`details.sections.${i}.body`, s.body, 'p', { multiline: true, placeholder: 'Section description' })}
            </div>

            <figure className="pd__rowFigure" data-reveal={flip ? 'left' : 'right'}>
              <div className="pd__plate">
                {editable
                  ? <EditableImage src={s.image} alt={s.heading || project.name} onChange={(value) => update(`details.sections.${i}.image`, value)} emptyLabel="Add section image" />
                  : s.image && <img src={s.image} alt={s.heading || project.name} loading="lazy" />}
              </div>
              {(s.caption || s.captionRight || editable) && (
                <figcaption>
                  {text(`details.sections.${i}.caption`, s.caption, 'span', { placeholder: 'Left caption' })}
                  {text(`details.sections.${i}.captionRight`, s.captionRight, 'span', { placeholder: 'Right caption' })}
                </figcaption>
              )}
            </figure>
            {editable && (
              <div className="pd__blockTools">
                <label>Image layout
                  <select value={s.side || 'auto'} onChange={(event) => update(`details.sections.${i}.side`, event.target.value)}>
                    <option value="auto">Alternate</option>
                    <option value="left">Image left</option>
                    <option value="right">Image right</option>
                  </select>
                </label>
                <RemoveButton onClick={() => remove('details.sections', i)} label="Delete section" />
              </div>
            )}
          </article>
        );
      })}
      {editable && <button type="button" className="pd__addInline" onClick={() => add('details.sections', { eyebrow: '', heading: '', body: '', image: '', caption: '', captionRight: '', side: 'auto' })}>+ Add case-study section</button>}
    </section>
  );
}
