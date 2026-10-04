import { useState } from 'react';
import { contact } from '../data/site.js';
import Eyebrow from './ui/Eyebrow.jsx';
import PillButton from './ui/PillButton.jsx';
import SocialRow from './ui/SocialRow.jsx';
import useSplitText from '../hooks/useSplitText.js';
import './Contact.css';

export default function Contact() {
  const heading = useSplitText(0.06);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const apiBase = import.meta.env.VITE_API_URL || '';

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch(`${apiBase}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to send message');

      setForm({ name: '', email: '', message: '' });
      setStatus('Thanks, I will be in touch.');
    } catch (error) {
      setStatus(error.message);
    }
  }

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

          <form onSubmit={handleSubmit} data-reveal>
            <div className="contact__formRow">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <textarea
              name="message"
              rows="5"
              placeholder="Tell me about your project"
              value={form.message}
              onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            />
            <div className="contact__formActions">
              <button type="submit" className="contact__submit">{contact.cta}</button>
              {status && <span className="contact__status">{status}</span>}
            </div>
          </form>

          <div className="contact__foot">
            <div className="contact__chip">{contact.footerChip}</div>
            <SocialRow items={contact.socials} variant="outline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
