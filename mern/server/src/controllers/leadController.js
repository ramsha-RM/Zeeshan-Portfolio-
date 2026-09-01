import Lead from '../models/Lead.js';

export const createLead = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
    const lead = await Lead.create({ name, email, message });
    res.status(201).json({ id: lead._id });
  } catch (err) { next(err); }
};
