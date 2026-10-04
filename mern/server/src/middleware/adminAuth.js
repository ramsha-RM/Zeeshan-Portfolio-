import crypto from 'node:crypto';

const safeEqual = (a, b) => {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
};

export const isAdmin = (req) => { 
  const expected = process.env.ADMIN_KEY;
  const given = req.get('x-admin-key');
  if (!expected || !given) return false;
  return safeEqual(given, expected);
};

export const requireAdmin = (req, res, next) => {
  if (!process.env.ADMIN_KEY) {
    return res.status(503).json({ message: 'ADMIN_KEY is not configured on the server' });
  }
  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Invalid admin key' });
  }
  next();
};
