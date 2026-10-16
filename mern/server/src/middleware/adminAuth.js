import crypto from 'node:crypto';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 30 * 60;
const MIN_SECRET_LENGTH = 8;
const developmentSessionSecret = crypto.randomBytes(32).toString('base64url');

const configuredOrigins = () =>
  (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const getSessionSecret = () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret?.trim().length >= MIN_SECRET_LENGTH) return secret.trim();
  return process.env.NODE_ENV === 'production' ? '' : developmentSessionSecret;
};

const safeEqual = (a, b) => {
  const left = Buffer.from(String(a ?? ''));
  const right = Buffer.from(String(b ?? ''));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
};

export const isAdminKeyConfigured = () => {
  const key = process.env.ADMIN_KEY?.trim();
  return Boolean(key && key.length >= MIN_SECRET_LENGTH);
};

export const assertAdminConfiguration = () => {
  if (process.env.NODE_ENV !== 'production') return;
  if (!isAdminKeyConfigured()) {
    throw new Error('Set ADMIN_KEY to a randomly generated secret of at least 32 characters.');
  }
  if (!process.env.ADMIN_SESSION_SECRET?.trim() || process.env.ADMIN_SESSION_SECRET.trim().length < MIN_SECRET_LENGTH) {
    throw new Error('Set ADMIN_SESSION_SECRET to a randomly generated secret of at least 32 characters.');
  }
  if (process.env.ADMIN_KEY.trim() === process.env.ADMIN_SESSION_SECRET.trim()) {
    throw new Error('ADMIN_KEY and ADMIN_SESSION_SECRET must be different values.');
  }
}

export const verifyAdminKey = (value) => {
  if (!isAdminKeyConfigured() || String(value ?? '').length > 256) return false;
  return safeEqual(value, process.env.ADMIN_KEY.trim());
};

const sign = (payload, secret) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url');

const readCookie = (req, name) => {
  const cookieHeader = req.get?.('cookie') || req.headers?.cookie || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return '';
    }
  }
  return '';
};

export const createAdminSessionCookie = () => {
  const secret = getSessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters in production.');

  const payload = Buffer.from(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      nonce: crypto.randomBytes(16).toString('base64url')
    })
  ).toString('base64url');
  const token = `${payload}.${sign(payload, secret)}`;
  const secure = process.env.NODE_ENV === 'production';
  const sameSite = secure ? 'None' : 'Lax';

  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=${SESSION_TTL_SECONDS}${secure ? '; Secure' : ''}`;
};

export const clearAdminSessionCookie = () => {
  const secure = process.env.NODE_ENV === 'production';
  const sameSite = secure ? 'None' : 'Lax';
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=0${secure ? '; Secure' : ''}`;
};

export const isAdmin = (req) => {
  const secret = getSessionSecret();
  if (!secret) return false;

  const token = readCookie(req, SESSION_COOKIE);
  const separator = token.indexOf('.');
  if (separator < 1) return false;

  const payload = token.slice(0, separator);
  const suppliedSignature = Buffer.from(token.slice(separator + 1));
  const expectedSignature = Buffer.from(sign(payload, secret));
  if (
    suppliedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
};

export const requireTrustedOrigin = (req, res, next) => {
  const origin = req.get?.('origin');
  const isDevelopmentLocalhost =
    process.env.NODE_ENV !== 'production' &&
    typeof origin === 'string' &&
    /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

  if (isDevelopmentLocalhost || (origin && configuredOrigins().includes(origin))) {
    return next();
  }

  return res.status(403).json({ message: 'Request origin is not allowed' });
};

export const requireAdmin = (req, res, next) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Admin session expired or not authenticated' });
  }
  res.set('Cache-Control', 'no-store');
  next();
};
