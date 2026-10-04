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
        <div className="div">
          <a href="/" aria-label="Home">
            <img className="nav__logo" src={mainIcon} alt="Main Icon" />
          </a>
        </div>
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
