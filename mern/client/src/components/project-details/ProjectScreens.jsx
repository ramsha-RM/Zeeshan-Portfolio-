import React from 'react';
import { EditableImage, EditableText } from './InlineEdit.jsx';

export default function ProjectScreens({ project, editable = false, update }) {
  const { screens } = project.details;
  const hasDevices = screens.desktop || screens.mobile;
  if (!editable && !screens.heading && !hasDevices && !screens.thankYou) return null;
  const text = (path, value, as, props = {}) => {
    if (editable) return <EditableText as={as} value={value} onChange={(next) => update(path, next)} {...props} />;
    const { placeholder: _placeholder, multiline: _multiline, ...htmlProps } = props;
    return React.createElement(as, htmlProps, value);
  };
  const image = (path, src, alt, className, emptyLabel) => editable
    ? <EditableImage src={src} alt={alt} className={className} onChange={(value) => update(path, value)} emptyLabel={emptyLabel} />
    : src && <img src={src} alt={alt} loading="lazy" />;

  return (
    <section className="pd__block shell">
      <div className="pd__screensHead" data-reveal>
        {(screens.eyebrow || editable) && text('details.screens.eyebrow', screens.eyebrow, 'span', { className: 'pd__script', placeholder: 'Screens eyebrow' })}
        {text('details.screens.heading', screens.heading, 'h2', { className: 'pd__heading pd__heading--center', placeholder: 'Screens heading' })}
      </div>

      {(hasDevices || editable) && (
        <div className="pd__devices">
          {(screens.desktop || editable) && (
            <div className="pd__plate pd__plate--desktop" data-reveal="left">
              {image('details.screens.desktop', screens.desktop, `${project.name} desktop screens`, '', 'Add desktop screen')}
            </div>
          )}
          {(screens.mobile || editable) && (
            <div className="pd__plate pd__plate--mobile" data-reveal="right">
              {image('details.screens.mobile', screens.mobile, `${project.name} mobile screens`, '', 'Add mobile screen')}
            </div>
          )}
        </div>
      )}

      {(screens.thankYou || editable) && (
        <>
          <hr className="pd__rule" />
          <div className="pd__plate pd__plate--thanks" data-reveal>
            {image('details.screens.thankYou', screens.thankYou, `${project.name} closing card`, '', 'Add closing image')}
          </div>
        </>
      )}
    </section>
  );
}
