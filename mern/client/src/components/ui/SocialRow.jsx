import Icon from './Icon.jsx';

export default function SocialRow({ items, variant = 'plain' }) {
  return (
    <div className={'socials socials--' + variant}>
      {items.map((name) => (
        <a key={name} href="#" aria-label={name}>
          <Icon name={name} size={14} />
        </a>
      ))}
    </div>
  );
}
