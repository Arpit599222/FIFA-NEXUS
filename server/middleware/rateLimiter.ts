import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter for the MVP
const requestCounts = new Map<string, { count: number, resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or initial state
    requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({ 
      error: 'Too many requests',
      message: 'You have exceeded the maximum number of AI requests. Please try again in a moment.' 
    });
  }

  record.count += 1;
  next();
};
