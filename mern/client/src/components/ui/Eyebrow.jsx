export default function Eyebrow({ children, script = false, dark = false, ...rest }) {
  const cls = ['eyebrow', script && 'eyebrow--script', dark && 'eyebrow--dark'].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>{children}</div>;
}
