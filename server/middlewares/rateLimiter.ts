import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_GLOBAL_MAX ? parseInt(process.env.RATE_LIMIT_GLOBAL_MAX, 10) : 50000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.BENCHMARK_MODE === 'true',
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_AUTH_MAX ? parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

// Strict limiter for expensive AI creation and revision endpoints
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_AI_MAX ? parseInt(process.env.RATE_LIMIT_AI_MAX, 10) : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'AI generation request limit reached. Please wait before submitting more generation requests.',
  },
});

// Higher throughput limiter for read-heavy public endpoints
export const publicReadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_PUBLIC_MAX ? parseInt(process.env.RATE_LIMIT_PUBLIC_MAX, 10) : 100000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.BENCHMARK_MODE === 'true',
  message: {
    message: 'Rate limit exceeded on public reads.',
  },
});

