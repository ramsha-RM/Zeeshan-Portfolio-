import { waitForDb } from '../config/db.js';

/** Rejects with 503 (instead of hanging or faking success) when MongoDB is unavailable. */
export const requireDb = async (_req, res, next) => {
  if (await waitForDb()) return next();
  res.set('Retry-After', '30');
  return res.status(503).json({ message: 'The database is temporarily unavailable. Please try again shortly.' });
};
