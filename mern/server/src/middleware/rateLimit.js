/**
 * Small fixed-window, in-memory rate limiter (no extra dependency).
 *
 * Note: memory is per process. On serverless platforms each instance keeps its
 * own counters, so this is a speed bump rather than a hard guarantee. For a
 * strict limit, back it with a shared store (e.g. Upstash/Redis).
 */
export const createRateLimiter = ({ windowMs, max, message, maxKeys = 10000 }) => {
  const hits = new Map();

  const prune = (now) => {
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
    while (hits.size > maxKeys) hits.delete(hits.keys().next().value);
  };

  const middleware = (req, res, next) => {
    const now = Date.now();
    if (hits.size > maxKeys) prune(now);

    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    let entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    if (entry.count >= max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ message });
    }

    entry.count += 1;
    return next();
  };

  middleware.reset = (req) => hits.delete(req.ip || req.socket?.remoteAddress || 'unknown');
  return middleware;
};
