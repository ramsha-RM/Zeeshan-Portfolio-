const HREF =
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@800&family=Reem+Kufi+Fun:wght@400;500&display=swap';

if (typeof document !== 'undefined' && !document.querySelector(`link[href="${HREF}"]`)) {
  for (const [rel, href, cross] of [
    ['preconnect', 'https://fonts.googleapis.com', false],
    ['preconnect', 'https://fonts.gstatic.com', true],
    ['stylesheet', HREF, false]
  ]) {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (cross) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }
}
