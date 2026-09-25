import { NextFunction, Request, Response } from "express";

// Minimal in-memory fixed-window limiter — no extra dependency needed for a
// single-instance deployment. It resets on restart and isn't shared across
// replicas; a multi-instance deployment would need a shared store (e.g.
// Redis) instead.
export function rateLimit(windowMs: number, max: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip ?? "unknown";
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      return res.status(429).json({ error: "Too many requests, try again later" });
    }

    entry.count += 1;
    next();
  };
}
