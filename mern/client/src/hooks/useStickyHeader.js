import { useEffect, useState } from 'react';

/** true once the page has scrolled past `at` px — drives the frosted bar state. */
export default function useStickyHeader(at = 24) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => setStuck(scrollY > at);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, [at]);
  return stuck;
}
