import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { nav, contact } from '../data/site.js';
import AnimatedButton from './ui/AnimatedButton.jsx';
import useStickyHeader from '../hooks/useStickyHeader.js';
import useScrollSpy from '../hooks/useScrollSpy.js';
import logo from '../assets/logo.svg';
import './Navbar.css';

const IDS = nav.map((n) => n.id);
const base = () => (window.location.pathname === '/' ? '' : '/');

/**
 * Header: logo left; on the right a pill with "Let's Talk" and an icon-only menu
 * button (same on every page). The button opens a full-screen menu that grows
 * as a circle out of the button. While open: page scroll is locked, the rest of
 * the page is inert, Tab stays inside the menu, Esc closes, and focus returns to
 * the button.
 */
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
  const tools = useRef(null);
  const burger = useRef(null);
  const menu = useRef(null);

  // Admin "More" panel: close on outside click.
  useEffect(() => {
    if (!toolsOpen) return undefined;
    const away = (e) => { if (!tools.current?.contains(e.target)) setToolsOpen(false); };
    document.addEventListener('click', away);
    return () => document.removeEventListener('click', away);
  }, [toolsOpen]);

  // Esc closes whichever panel is open.
  useEffect(() => {
    if (!open && !toolsOpen) return undefined;
    const esc = (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setToolsOpen(false);
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open, toolsOpen]);

  // Full-screen menu: scroll lock, inert page, focus in and back out.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const page = document.querySelectorAll('main, footer');
    root.classList.toggle('menu-open', open);
    page.forEach((el) => { el.inert = open; });
    if (menu.current) menu.current.inert = !open;

    if (open) {
      const t = setTimeout(() => menu.current?.querySelector('a')?.focus({ preventScroll: true }), 380);
      return () => clearTimeout(t);
    }
    if (menu.current?.contains(document.activeElement)) burger.current?.focus({ preventScroll: true });
    return undefined;
  }, [open]);

  useEffect(() => () => {
    document.documentElement.classList.remove('menu-open');
    document.querySelectorAll('main, footer').forEach((el) => { el.inert = false; });
  }, []);

  // Keep Tab cycling between the menu button and the menu's links.
  const trapTab = (e) => {
    if (!open || e.key !== 'Tab') return;
    const items = [burger.current, ...menu.current.querySelectorAll('a')];
    const i = items.indexOf(document.activeElement);
    const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
    e.preventDefault();
    items[next].focus();
  };

  const toggleMenu = () => {
    const r = burger.current.getBoundingClientRect();
    menu.current.style.setProperty('--mx', `${Math.round(r.left + r.width / 2)}px`);
    menu.current.style.setProperty('--my', `${Math.round(r.top + r.height / 2)}px`);
    setToolsOpen(false);
    setOpen((v) => !v);
  };

  return (
    <>
      <header className={'nav' + (stuck ? ' nav--stuck' : '') + (open ? ' nav--open' : '')} onKeyDown={trapTab}>
        <div className="nav__inner">
          <a className="nav__home" href="/" aria-label="Zeeshan Munawar — home">
            <img className="nav__logo" src={logo} width="48" height="48" alt="" />
          </a>

          <div className="nav__actions">
            {adminTools && (
              <div className="nav__adminTools" ref={tools}>
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

            <div className="nav__dock">
              <AnimatedButton href="#contact" size="sm" label="Let’s Talk" activeLabel="Let’s Go" tabIndex={open ? -1 : undefined} />
              <button
                type="button"
                ref={burger}
                className={'nav__burger' + (open ? ' is-open' : '')}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={toggleMenu}
                data-burger
              >
                <span className="nav__burgerIcon" aria-hidden="true"><i /><i /><i /></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        className={'menu' + (open ? ' is-open' : '')}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        onKeyDown={trapTab}
      >
        <nav className="menu__links" aria-label="Primary">
          {nav.map((item, i) => (
            <a
              key={item.id}
              href={base() + '#' + item.id}
              aria-current={active === item.id ? 'true' : undefined}
              style={{ '--i': i }}
              onClick={() => setOpen(false)}
            >
              <small>{String(i + 1).padStart(2, '0')}</small>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="menu__foot">
          <a className="menu__mail" href={`mailto:${contact.email}`} onClick={() => setOpen(false)}>{contact.email}</a>
          {contact.socials.map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
          ))}
        </div>
      </div>
    </>
  );
}
