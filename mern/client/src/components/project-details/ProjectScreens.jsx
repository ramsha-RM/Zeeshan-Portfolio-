export default function ProjectScreens({ project }) {
  const { screens } = project.details;
  const hasDevices = screens.desktop || screens.mobile;
  if (!screens.heading && !hasDevices && !screens.thankYou) return null;

  return (
    <section className="pd__block shell">
      <div className="pd__screensHead" data-reveal>
        {screens.eyebrow && <span className="pd__script">{screens.eyebrow}</span>}
        <h2 className="pd__heading pd__heading--center">{screens.heading}</h2>
      </div>

      {hasDevices && (
        <div className="pd__devices">
          {screens.desktop && (
            <div className="pd__plate pd__plate--desktop" data-reveal="left">
              <img src={screens.desktop} alt={`${project.name} desktop screens`} loading="lazy" />
            </div>
          )}
          {screens.mobile && (
            <div className="pd__plate pd__plate--mobile" data-reveal="right">
              <img src={screens.mobile} alt={`${project.name} mobile screens`} loading="lazy" />
            </div>
          )}
        </div>
      )}

      {screens.thankYou && (
        <>
          <hr className="pd__rule" />
          <div className="pd__plate pd__plate--thanks" data-reveal>
            <img src={screens.thankYou} alt={`${project.name} closing card`} loading="lazy" />
          </div>
        </>
      )}
    </section>
  );
}
