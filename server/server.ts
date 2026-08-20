import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import crypto from 'node:crypto';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.js';
import userRouter from './routes/userRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import { pool, checkDatabaseHealth } from './lib/prisma.js';
import logger from './lib/logger.js';
import { register, httpRequestDurationHistogram, httpRequestTotalCounter } from './lib/metrics.js';
import { globalLimiter, authLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security Headers & Express Fingerprint Removal
app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: false, // API server serves JSON / embedded previews
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Response Compression
app.use(compression());

// Request Correlation ID & Telemetry Middleware
app.use((req: Request, res: Response, next) => {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);

  const startTime = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedNs = process.hrtime.bigint() - startTime;
    const elapsedSec = Number(elapsedNs) / 1e9;
    const route = req.baseUrl || req.path || 'unknown';

    // Metrics recording
    httpRequestDurationHistogram.observe(
      { method: req.method, route, status_code: res.statusCode.toString() },
      elapsedSec
    );
    httpRequestTotalCounter.inc({
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    });

    logger.info(
      {
        reqId,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: (elapsedSec * 1000).toFixed(2),
        ip: req.ip,
      },
      'HTTP Request completed'
    );
  });

  next();
});

// CORS Configuration
const trustedOrigins = process.env.TRUSTED_ORIGIN
  ? process.env.TRUSTED_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin || trustedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
};

app.use(cors(corsOptions));

// Health Probes
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/readyz', async (req: Request, res: Response) => {
  const dbHealth = await checkDatabaseHealth();
  const isHealthy = dbHealth.ok;

  const statusObj = {
    status: isHealthy ? 'ready' : 'degraded',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbHealth.ok,
      latencyMs: dbHealth.latencyMs,
    },
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  };

  res.status(isHealthy ? 200 : 503).json(statusObj);
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// Global Rate Limiting
app.use(globalLimiter);

// Better-Auth Authentication Routes (with auth rate limiter)
app.use('/api/auth', authLimiter, toNodeHandler(auth));

// Request Payload Parser (Strict 100kb limit for general routes)
app.use(express.json({ limit: '100kb' }));

// Application Routes
app.use('/api/project', projectRouter);
app.use('/api/user', userRouter);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Server Lifecycle Management
const server = app.listen(PORT, () => {
  logger.info(`WebCraft server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Received shutdown signal. Starting graceful shutdown...');

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await pool.end();
      logger.info('PostgreSQL connection pool closed.');
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during pool shutdown');
      process.exit(1);
    }
  });

  // Force close if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Graceful shutdown timeout exceeded (10s). Forcing process exit.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
