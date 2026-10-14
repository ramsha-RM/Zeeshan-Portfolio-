// import { useEffect, useRef, useState } from 'react';
// import { nav } from '../data/site.js';
// import PillButton from './ui/PillButton.jsx';
// import useStickyHeader from '../hooks/useStickyHeader.js';
// import useScrollSpy from '../hooks/useScrollSpy.js';
// import mainIcon from '../assets/Subtract.png';
// import './Navbar.css';

// const IDS = nav.map((n) => n.id);

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const stuck = useStickyHeader(24);
//   const active = useScrollSpy(IDS);
//   const wrap = useRef(null);

//   useEffect(() => {
//     if (!open) return;
//     const away = (e) => { if (!wrap.current || !wrap.current.contains(e.target)) setOpen(false); };
//     const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
//     document.addEventListener('click', away);
//     document.addEventListener('keydown', esc);
//     return () => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc); };
//   }, [open]);

//   return (
//     <header className={'nav' + (stuck ? ' nav--stuck' : '')}>
//       <div className="nav__inner shell">
//         <div className="div">
//           <img className="nav__logo" src={mainIcon} alt="Main Icon" />
//         </div>
    

//         <div className="nav__actions" ref={wrap}>
//           <button
//             type="button"
//             className={'nav__burger' + (open ? ' is-open' : '')}
//             aria-expanded={open}
//             aria-controls="menu-panel"
//             aria-label={open ? 'Close menu' : 'Open menu'}
//             onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
//           >
//             {/* <span>{open ? 'Close' : 'Menu'}</span> */}
//             <span className="nav__burgerIcon"><i /><i /></span>
//           </button>

//           <PillButton href="#contact">Let&rsquo;s Talk</PillButton>

//           <div id="menu-panel" className={'nav__panel' + (open ? ' is-open' : '')}>
//             {nav.map((item, i) => (
//               <a
//                 key={item.id}
//                 href={'#' + item.id}
//                 className={active === item.id ? 'is-active' : ''}
//                 style={{ '--d': (open ? i * 0.05 : 0) + 's' }}
//                 onClick={() => setOpen(false)}
//               >
//                 {item.label}
//                 <span className="nav__ul" />
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/site.js';
import PillButton from './ui/PillButton.jsx';
import useStickyHeader from '../hooks/useStickyHeader.js';
import useScrollSpy from '../hooks/useScrollSpy.js';
import mainIcon from '../assets/Subtract.png';
import './Navbar.css';

const IDS = nav.map((n) => n.id);
const base = () => (window.location.pathname === '/' ? '' : '/');

export default function Navbar({
  adminTools = false,
  projects = [],
  selectedProjectId,
  published = false,
  dirty = false,
  saving = false,
  onAddProject,
  onSelectProject,
  onSaveProject,
  onDeleteProject,
  onTogglePublish,
  onSignOut
}) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const stuck = useStickyHeader(24);
  const active = useScrollSpy(IDS);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open && !toolsOpen) return;
    const away = (e) => {
      if (!wrap.current || !wrap.current.contains(e.target)) {
        setOpen(false);
        setToolsOpen(false);
      }
    };
    const esc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setToolsOpen(false);
      }
    };
    document.addEventListener('click', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc); };
  }, [open, toolsOpen]);

  return (
    <header className={'nav' + (stuck ? ' nav--stuck' : '')}>
      <div className="nav__inner shell">
        <div className="div">
          <a href="/" aria-label="Home">
            <img className="nav__logo" src={mainIcon} alt="" />
          </a>
        </div>
        <div className="nav__actions" ref={wrap}>
          {adminTools && (
            <div className="nav__adminTools">
              <button
                type="button"
                className="nav__more"
                aria-expanded={toolsOpen}
                aria-controls="admin-tools-panel"
                onClick={() => {
                  setToolsOpen((value) => !value);
                  setOpen(false);
                }}
              >
                More{dirty && <><span className="nav__dirtyIndicator" aria-hidden="true">•</span><span className="sr-only"> (unsaved changes)</span></>}
                <span className="nav__moreArrow" aria-hidden="true">⌄</span>
              </button>
              <div id="admin-tools-panel" className={'nav__adminPanel' + (toolsOpen ? ' is-open' : '')}>
                <div className="nav__adminPanelActions">
                  <button type="button" onClick={() => { onAddProject?.(); setToolsOpen(false); }}>+ Add project</button>
                  <button type="button" onClick={onSaveProject} disabled={!dirty || saving}>
                    {saving ? 'Saving…' : dirty ? 'Save changes' : 'All changes saved'}
                  </button>
                  <button type="button" onClick={onTogglePublish}>
                    {published ? 'Unpublish project' : 'Publish project'}
                  </button>
                  <button type="button" onClick={onDeleteProject} disabled={!projects.some((project) => project._id === selectedProjectId)}>
                    Delete project
                  </button>
                </div>
                <span className="nav__adminLabel">Projects</span>
                <div className="nav__projectList">
                  {projects.map((project) => (
                    <button
                      type="button"
                      key={project._id}
                      className={project._id === selectedProjectId ? 'is-active' : ''}
                      onClick={() => { onSelectProject?.(project._id); setToolsOpen(false); }}
                    >
                      <span>{project.name || 'Untitled project'}</span>
                      <small>{project.published ? 'Live' : 'Draft'}</small>
                    </button>
                  ))}
                  {!projects.length && <span className="nav__adminEmpty">No saved projects yet.</span>}
                </div>
                <button type="button" className="nav__signOut" onClick={onSignOut}>Sign out</button>
              </div>
            </div>
          )}
          <button
            type="button"
            className={'nav__burger' + (open ? ' is-open' : '')}
            aria-expanded={open}
            aria-controls="menu-panel"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
          >
            {/* <span>{open ? 'Close' : 'Menu'}</span> */}
            <span className="nav__burgerIcon"><i /><i /></span>
          </button>

          <PillButton href="#contact">Let&rsquo;s Talk</PillButton>

          <div id="menu-panel" className={'nav__panel' + (open ? ' is-open' : '')}>
            {nav.map((item, i) => (
              <a
                key={item.id}
                href={base() + '#' + item.id}
                className={active === item.id ? 'is-active' : ''}
                style={{ '--d': (open ? i * 0.05 : 0) + 's' }}
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span className="nav__ul" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
