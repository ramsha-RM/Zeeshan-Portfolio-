import Icon from './Icon.jsx';

export default function SocialRow({ items, variant = 'plain' }) {
  return (
    <div className={'socials socials--' + variant}>
      {items.map(({ name, label, href }) => (
        <a key={name} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
          <Icon name={name} size={14} />
        </a>
      ))}
    </div>
  );
}
