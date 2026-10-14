import Lead, { LEAD_LIMITS } from '../models/Lead.js';
import { waitForDb } from '../config/db.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (value) => (typeof value === 'string' ? value.trim() : '');

export const createLead = async (req, res) => {
  const name = text(req.body?.name);
  const email = text(req.body?.email).toLowerCase();
  const message = text(req.body?.message);

  // Honeypot: real visitors never see or fill the "company" field. Pretend
  // success so bots don't learn they were filtered.
  if (text(req.body?.company)) {
    return res.status(201).json({ ok: true });
  }

  if (!name || !email) {
    return res.status(400).json({ message: 'Please enter your name and email.' });
  }
  if (name.length > LEAD_LIMITS.name) {
    return res.status(400).json({ message: `Name must be ${LEAD_LIMITS.name} characters or fewer.` });
  }
  if (email.length > LEAD_LIMITS.email || !emailPattern.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (message.length > LEAD_LIMITS.message) {
    return res.status(400).json({ message: `Message must be ${LEAD_LIMITS.message} characters or fewer.` });
  }

  if (!(await waitForDb())) {
    res.set('Retry-After', '30');
    return res.status(503).json({ message: 'Messages can’t be received right now. Please try again in a few minutes.' });
  }

  try {
    const lead = await Lead.create({ name, email, message });
    return res.status(201).json({ ok: true, id: lead._id });
  } catch (err) {
    console.error('Create lead error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please check your details and try again.' });
    }
    return res.status(503).json({ message: 'Messages can’t be received right now. Please try again in a few minutes.' });
  }
};
