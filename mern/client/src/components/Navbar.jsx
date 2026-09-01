import { useEffect, useRef, useState } from 'react';
import { nav } from '../data/site.js';
import PillButton from './ui/PillButton.jsx';
import useStickyHeader from '../hooks/useStickyHeader.js';
import useScrollSpy from '../hooks/useScrollSpy.js';
import './Navbar.css';

const IDS = nav.map((n) => n.id);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const stuck = useStickyHeader(24);
  const active = useScrollSpy(IDS);
  const wrap = useRef(null);

  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (!wrap.current || !wrap.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('click', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <header className={'nav' + (stuck ? ' nav--stuck' : '')}>
      <div className="nav__inner shell">
        <a href="#top" className="nav__logo" aria-label="Home">
          <svg viewBox="0 0 34 34" width="34" height="34" aria-hidden="true">
            <circle cx="17" cy="17" r="16" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M22.5 9.5c2.6 3.2 1.4 8.2-1.6 11.4-3 3.2-7.6 4.4-10.2 2.1-2.6-2.3-1.4-7 1.3-10.3 2.7-3.3 7.9-6.4 10.5-3.2Z" fill="currentColor" />
          </svg>
        </a>

        <div className="nav__actions" ref={wrap}>
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
                href={'#' + item.id}
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
