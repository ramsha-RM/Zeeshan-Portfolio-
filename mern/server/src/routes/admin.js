import { Router } from 'express';
import {
  assertAdminConfiguration,
  clearAdminSessionCookie,
  createAdminSessionCookie,
  isAdmin,
  isAdminKeyConfigured,
  requireAdmin,
  requireTrustedOrigin,
  verifyAdminKey
} from '../middleware/adminAuth.js';

const router = Router();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LIMIT = 5;
const loginAttempts = new Map();

const checkLoginLimit = (req, res, next) => {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (loginAttempts.size > 10000) {
    for (const [address, attempt] of loginAttempts) {
      if (attempt.resetAt <= now) loginAttempts.delete(address);
    }
    if (loginAttempts.size > 10000) {
      loginAttempts.delete(loginAttempts.keys().next().value);
    }
  }
  let attempt = loginAttempts.get(ip);

  if (!attempt || attempt.resetAt <= now) {
    attempt = { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(ip, attempt);
  }

  if (attempt.count >= LOGIN_LIMIT) {
    res.set('Retry-After', String(Math.ceil((attempt.resetAt - now) / 1000)));
    return res.status(429).json({ message: 'Too many login attempts. Try again later.' });
  }

  attempt.count += 1;
  next();
};

router.post('/login', requireTrustedOrigin, checkLoginLimit, (req, res) => {
  if (!isAdminKeyConfigured()) {
    return res.status(503).json({
      message: 'Admin access is not configured. Set ADMIN_KEY to a random secret of at least 32 characters.'
    });
  }

  if (!verifyAdminKey(req.body?.passkey ?? req.body?.pin ?? '')) {
    return res.status(401).json({ message: 'Invalid admin key' });
  }

  loginAttempts.delete(req.ip || req.socket.remoteAddress || 'unknown');
  try {
    assertAdminConfiguration();
    res.set('Cache-Control', 'no-store');
    res.set('Set-Cookie', createAdminSessionCookie());
    return res.json({ authenticated: true });
  } catch (error) {
    console.error('Admin session configuration error:', error.message);
    return res.status(503).json({ message: 'Admin sessions are not configured on the server' });
  }
});

router.post('/logout', requireTrustedOrigin, (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('Set-Cookie', clearAdminSessionCookie());
  return res.json({ authenticated: false });
});

router.get('/me', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ authenticated: isAdmin(req) });
});

router.get('/ping', requireAdmin, (_req, res) => {
  res.json({ ok: true, admin: true });
});

export default router;
