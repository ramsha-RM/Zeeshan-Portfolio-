import React from 'react';
import { EditableText, RemoveButton } from './InlineEdit.jsx';

export default function ProjectHighlights({ project, editable = false, update, add, remove }) {
  const { highlights } = project.details;
  if (!editable && !highlights.heading && !highlights.items.length) return null;
  const text = (path, value, as, props = {}) => {
    if (editable) return <EditableText as={as} value={value} onChange={(next) => update(path, next)} {...props} />;
    const { placeholder: _placeholder, multiline: _multiline, ...htmlProps } = props;
    return React.createElement(as, htmlProps, value);
  };

  return (
    <section className="pd__block shell">
      <div className="pd__dark" data-reveal>
        {(highlights.eyebrow || editable) && text('details.highlights.eyebrow', highlights.eyebrow, 'span', { className: 'pd__script pd__script--inline', placeholder: 'Highlights eyebrow' })}
        {text('details.highlights.heading', highlights.heading, 'h2', { className: 'pd__heading pd__heading--light', placeholder: 'Highlights heading' })}

        <div className="pd__points">
          {highlights.items.map((item, i) => (
            <div className={'pd__point' + (editable ? ' pd__editableItem' : '')} key={i}>
              <span className="pd__num">{String(i + 1).padStart(2, '0')}</span>
              {text(`details.highlights.items.${i}.title`, item.title, 'h3', { placeholder: 'Highlight title' })}
              {text(`details.highlights.items.${i}.body`, item.body, 'p', { multiline: true, placeholder: 'Highlight details' })}
              {editable && <RemoveButton onClick={() => remove('details.highlights.items', i)} label="Delete highlight" />}
            </div>
          ))}
        </div>
        {editable && <button type="button" className="pd__addInline pd__addInline--dark" onClick={() => add('details.highlights.items', { title: '', body: '' })}>+ Add highlight</button>}
      </div>
    </section>
  );
}
