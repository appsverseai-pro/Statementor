/**
 * Simple in-memory rate limiter.
 * Limits requests per IP to `maxRequests` within a `windowMs` sliding window.
 */

interface RateLimitEntry {
  count: number
  windowStart: number
}

const store = new Map<string, RateLimitEntry>()

export function rateLimit(
  ip: string,
  maxRequests = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now - entry.windowStart > windowMs) {
    store.set(ip, { count: 1, windowStart: now })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, remaining: maxRequests - entry.count }
}

export function getClientIp(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
