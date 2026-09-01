import { contact } from '../data/site.js';
import Eyebrow from './ui/Eyebrow.jsx';
import PillButton from './ui/PillButton.jsx';
import SocialRow from './ui/SocialRow.jsx';
import useSplitText from '../hooks/useSplitText.js';
import './Contact.css';

export default function Contact() {
  const heading = useSplitText(0.06);

  return (
    <footer id="contact" className="contact">
      <div className="contact__block">
        <span className="contact__halo" />
        <div className="shell contact__inner">
          <Eyebrow dark data-reveal>{contact.eyebrow}</Eyebrow>

          <h2 className="contact__h" ref={heading}>
            {contact.heading[0]} <span className="contact__hLight">{contact.heading[1]}</span>
          </h2>

          <p className="contact__copy" data-reveal>
            {contact.lines[0]}<br />{contact.lines[1]}
          </p>

          <div data-reveal className="contact__cta">
            <PillButton ghost href="#">{contact.cta}</PillButton>
          </div>

          <div className="contact__foot">
            <div className="contact__chip">{contact.footerChip}</div>
            <SocialRow items={contact.socials} variant="outline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
