/** Lucide-style stroked glyphs on a 24px grid. One place for every icon in the page. */
const PATHS = {
  arrow: ['M5 12h14', 'm12 5 7 7-7 7'],
  folder: ['M4 20a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M3 14h7v7H3z', 'M14 14h7v7h-7z'],
  cross: ['M12 3v18', 'M3 12h18'],
  search: ['M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z', 'm20 20-3.5-3.5'],
  play: ['m5 3 14 9-14 9z'],
  frame: ['M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z', 'M9 8h6'],
  bars: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20h-20'],
  instagram: ['M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z', 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
  linkedin: ['M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z', 'M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4'],
  x: ['M4 4l16 16', 'M20 4L4 20'],
  threads: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M9 14c1 2 6 2 6-1s-6-3-6 0']
};

export default function Icon({ name, size = 14, stroke = 'currentColor', width = 1.7 }) {
  const paths = PATHS[name];
  if (!paths) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
