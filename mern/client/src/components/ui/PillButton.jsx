import Icon from './Icon.jsx';
import useMagnetic from '../../hooks/useMagnetic.js';

/** The black (or ghost) pill with the sliding arrow badge. */
export default function PillButton({ href = '#', children, ghost = false, ...rest }) {
  const ref = useMagnetic();
  return (
    <a ref={ref} href={href} className={'pill' + (ghost ? ' pill--ghost' : '')} {...rest}>
      <span>{children}</span>
      <span className="badge">
        <Icon name="arrow" size={ghost ? 12 : 13} stroke={ghost ? '#f4f4f3' : '#0a0b0c'} width={2} />
      </span>
    </a>
  );
}
