import { useState } from 'react';
import { contact } from '../data/site.js';
import Eyebrow from './ui/Eyebrow.jsx';
import SocialRow from './ui/SocialRow.jsx';
import useSplitText from '../hooks/useSplitText.js';
import { api } from '../lib/api.js';
import './Contact.css';

const EMPTY = { name: '', email: '', message: '', company: '' };

export default function Contact() {
  const heading = useSplitText(0.06);
  const [form, setForm] = useState(EMPTY);
  // status: idle | sending | success | error
  const [state, setState] = useState({ status: 'idle', message: '' });
  const sending = state.status === 'sending';

  const field = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (state.status === 'error' || state.status === 'success') setState({ status: 'idle', message: '' });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return; // guard against double submits
    setState({ status: 'sending', message: 'Sending…' });

    try {
      // credentials: 'omit' — the public form never needs the admin cookie.
      await api('/api/leads', { method: 'POST', body: form, credentials: 'omit' });
      setForm(EMPTY);
      setState({ status: 'success', message: 'Thanks — your message is on its way. I’ll be in touch soon.' });
    } catch (error) {
      setState({ status: 'error', message: error.message });
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

          <form className="contact__form" onSubmit={handleSubmit} aria-busy={sending} data-reveal>
            <div className="contact__formRow">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                aria-label="Your name"
                autoComplete="name"
                maxLength={100}
                value={form.name}
                onChange={field('name')}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                aria-label="Your email"
                autoComplete="email"
                maxLength={254}
                value={form.email}
                onChange={field('email')}
                required
              />
            </div>
            <textarea
              name="message"
              rows="5"
              placeholder="Tell me about your project"
              aria-label="Tell me about your project"
              maxLength={2000}
              value={form.message}
              onChange={field('message')}
            />
            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div className="contact__hp" aria-hidden="true">
              <label>
                Company
                <input type="text" name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={field('company')} />
              </label>
            </div>
            <div className="contact__formActions">
              <button type="submit" className="contact__submit" disabled={sending}>
                {sending ? 'Sending…' : contact.cta}
              </button>
              <span
                className={`contact__status contact__status--${state.status}`}
                role={state.status === 'error' ? 'alert' : 'status'}
                aria-live="polite"
              >
                {state.status === 'success' && <span aria-hidden="true">✓ </span>}
                {state.status === 'error' && <span aria-hidden="true">! </span>}
                {state.status === 'sending' ? '' : state.message}
              </span>
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
