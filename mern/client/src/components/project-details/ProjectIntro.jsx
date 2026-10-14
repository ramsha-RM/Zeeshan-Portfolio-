import React from 'react';
import { EditableImage, EditableText, RemoveButton } from './InlineEdit.jsx';

export default function ProjectIntro({ project, editable = false, update, add, remove }) {
  const { intro, colors, fonts } = project.details;
  const hasCopy = intro.heading || intro.paragraphs.length > 0;
  const hasTiles = colors.length > 0 || fonts.length > 0;

  if (!editable && !hasCopy && !intro.image && !hasTiles) return null;
  const text = (path, value, as, props = {}) => {
    if (editable) return <EditableText as={as} value={value} onChange={(next) => update(path, next)} {...props} />;
    const { placeholder: _placeholder, multiline: _multiline, ...htmlProps } = props;
    return React.createElement(as, htmlProps, value);
  };

  return (
    <section className="pd__block shell">
      {(hasCopy || editable) && (
        <div className="pd__intro">
          <div data-reveal="left">
            {(intro.eyebrow || editable) && text('details.intro.eyebrow', intro.eyebrow, 'span', { className: 'pd__script pd__script--inline', placeholder: 'Section eyebrow' })}
            {text('details.intro.heading', intro.heading, 'h2', { className: 'pd__heading', placeholder: 'Challenge heading' })}
          </div>
          <div className="pd__copy" data-reveal="right">
            {intro.paragraphs.map((paragraph, i) => (
              <div className={editable ? 'pd__editableItem' : ''} key={i}>
                {text(`details.intro.paragraphs.${i}`, paragraph, 'p', { multiline: true, placeholder: 'Paragraph text' })}
                {editable && <RemoveButton onClick={() => remove('details.intro.paragraphs', i)} label="Delete paragraph" />}
              </div>
            ))}
            {editable && <button type="button" className="pd__addInline" onClick={() => add('details.intro.paragraphs', '')}>+ Add paragraph</button>}
          </div>
        </div>
      )}

      {(intro.image || editable) && (
        <figure className="pd__wide" data-reveal>
          {editable ? (
            <EditableImage
              src={intro.image}
              alt={`${project.name} overview`}
              onChange={(value) => update('details.intro.image', value)}
              emptyLabel="Add an overview image"
            />
          ) : <img src={intro.image} alt={`${project.name} overview`} loading="lazy" />}
        </figure>
      )}

      {(hasTiles || editable) && (
        <div className="pd__tiles">
          <div className="pd__tile" data-reveal="left">
            <h3 className="pd__tileTitle">Colors</h3>
            <div className="pd__swatches">
              {colors.map((c, i) => (
                <div className={'pd__swatch' + (editable ? ' pd__editableItem' : '')} key={i}>
                  {editable
                    ? <input type="color" aria-label="Color swatch" value={c.hex || '#000000'} onChange={(event) => update(`details.colors.${i}.hex`, event.target.value)} />
                    : <span style={{ background: c.hex }} />}
                  {text(`details.colors.${i}.name`, c.name, 'em', { placeholder: 'Color name' })}
                  {text(`details.colors.${i}.hex`, c.hex, 'small', { placeholder: '#000000' })}
                  {editable && <RemoveButton onClick={() => remove('details.colors', i)} label="Delete color" />}
                </div>
              ))}
            </div>
            {editable && <button type="button" className="pd__addInline" onClick={() => add('details.colors', { name: '', hex: '#000000' })}>+ Add color</button>}
          </div>
          <div className="pd__tile" data-reveal="right">
            <h3 className="pd__tileTitle">Fonts</h3>
            <div className="pd__fonts">
              {fonts.map((f, i) => (
                <div className={'pd__font' + (editable ? ' pd__editableItem' : '')} key={i}>
                  {text(`details.fonts.${i}.sample`, f.sample || 'Aa', 'strong', { placeholder: 'Aa' })}
                  {text(`details.fonts.${i}.name`, f.name, 'em', { placeholder: 'Font name' })}
                  {editable && <RemoveButton onClick={() => remove('details.fonts', i)} label="Delete font" />}
                </div>
              ))}
            </div>
            {editable && <button type="button" className="pd__addInline" onClick={() => add('details.fonts', { name: '', sample: 'Aa' })}>+ Add font</button>}
          </div>
        </div>
      )}
    </section>
  );
}
