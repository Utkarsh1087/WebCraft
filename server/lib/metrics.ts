import client from 'prom-client';

// Collect default Node.js runtime metrics (heap memory, event loop lag, GC, CPU)
client.collectDefaultMetrics({ prefix: 'webcraft_' });

// HTTP Request Latency Histogram
export const httpRequestDurationHistogram = new client.Histogram({
  name: 'webcraft_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});

// HTTP Request Total Counter
export const httpRequestTotalCounter = new client.Counter({
  name: 'webcraft_http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code'],
});

// AI Generation Duration
export const aiGenerationDurationHistogram = new client.Histogram({
  name: 'webcraft_ai_generation_duration_seconds',
  help: 'Duration of OpenRouter AI calls in seconds',
  labelNames: ['operation', 'status'],
  buckets: [0.5, 1, 2, 5, 10, 20, 30],
});

export const register = client.register;
