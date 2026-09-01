import { useEffect, useState } from 'react';

/** Returns the id of the section in the middle band; "top" always wins near the top. */
export default function useScrollSpy(ids, { top = 'top' } = {}) {
  const [active, setActive] = useState(top);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (scrollY < 160) { setActive(top); return; }
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const onScroll = () => { if (scrollY < 160) setActive(top); };
    addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); };
  }, [ids, top]);

  return active;
}
