type RateLimitEntry = { count: number; resetAt: number };

const attempts = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function checkLoginRateLimit(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);

  if (!current || current.resetAt <= now) {
    const entry = { count: 1, resetAt: now + WINDOW_MS };
    attempts.set(ip, entry);
    return { allowed: true, retryAfter: Math.ceil(WINDOW_MS / 1000) };
  }

  if (current.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { allowed: true, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}
