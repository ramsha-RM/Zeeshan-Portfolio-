import mongoose from 'mongoose';

export const requireDb = (_req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  res.status(503).json({ message: 'Database is not connected' });
};