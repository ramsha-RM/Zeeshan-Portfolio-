import Lead from '../models/Lead.js';

export const createLead = async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ message: 'Message is too long' });
    }

    const lead = await Lead.create({ name, email, message });
    res.status(201).json({ id: lead._id });
  } catch (err) {
    console.error('Create lead error:', err.message);
    res.status(503).json({ message: 'Database unavailable. Please try again later.' });
  }
};
