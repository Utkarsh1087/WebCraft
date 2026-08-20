import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import { pool } from '../lib/prisma.js';

describe('WebCraft API Suite — Production Readiness Verification', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('1. System Observability & Health Probes', () => {
    it('GET /healthz should return 200 with healthy status and uptime', async () => {
      const res = await request(app).get('/healthz');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(typeof res.body.uptime).toBe('number');
      expect(res.headers['x-request-id']).toBeDefined();
    });

    it('GET /readyz should return readiness status and database connection probe', async () => {
      const res = await request(app).get('/readyz');
      expect([200, 503]).toContain(res.status);
      expect(res.body.status).toBeDefined();
      expect(res.body.database).toBeDefined();
      expect(typeof res.body.database.latencyMs).toBe('number');
    });

    it('GET /metrics should expose Prometheus formatted metrics', async () => {
      const res = await request(app).get('/metrics');
      expect(res.status).toBe(200);
      expect(res.text).toContain('webcraft_http_requests_total');
      expect(res.text).toContain('webcraft_nodejs_heap_size_used_bytes');
    });
  });

  describe('2. Security Hardening & Headers', () => {
    it('should NOT disclose X-Powered-By header', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['x-powered-by']).toBeUndefined();
    });

    it('should include Helmet security headers', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['strict-transport-security']).toBeDefined();
    });

    it('should inject X-Request-Id correlation header', async () => {
      const res = await request(app).get('/healthz');
      expect(res.headers['x-request-id']).toBeDefined();
      expect(res.headers['x-request-id'].length).toBeGreaterThan(10);
    });
  });

  describe('3. Public Project Endpoints & Caching', () => {
    it('GET /api/project/published should return paginated list of published projects without sensitive PII', async () => {
      const res = await request(app).get('/api/project/published?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.projects).toBeInstanceOf(Array);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(5);

      if (res.body.projects.length > 0) {
        const sample = res.body.projects[0];
        expect(sample.id).toBeDefined();
        expect(sample.name).toBeDefined();
        // Ensure sensitive emails are not leaked
        if (sample.user) {
          expect(sample.user.email).toBeUndefined();
        }
      }
    });

    it('GET /api/project/published should serve cache HIT on repeat request', async () => {
      const res1 = await request(app).get('/api/project/published?page=1&limit=10');
      expect(res1.status).toBe(200);

      const res2 = await request(app).get('/api/project/published?page=1&limit=10');
      expect(res2.status).toBe(200);
      expect(res2.headers['x-cache']).toBe('HIT');
    });

    it('GET /api/project/published/:projectId should return 404 for nonexistent project', async () => {
      const res = await request(app).get('/api/project/published/non-existent-uuid-999');
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('not found');
    });
  });

  describe('4. Input Validation & Error Handling', () => {
    it('GET /api/project/published with invalid page query should return 400 Bad Request', async () => {
      const res = await request(app).get('/api/project/published?page=-5');
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid query parameters');
    });

    it('POST /api/project/revision/:projectId with invalid body should return 400 or 401', async () => {
      const res = await request(app)
        .post('/api/project/revision/proj-123')
        .send({ message: '' });
      expect([400, 401]).toContain(res.status);
    });

    it('Unknown route should trigger 404 handler', async () => {
      const res = await request(app).get('/api/invalid-route-that-does-not-exist');
      expect(res.status).toBe(404);
      expect(res.body.message).toContain('Cannot GET');
    });
  });

  describe('5. Authentication & Authorization Boundaries', () => {
    it('GET /api/user/credits should block unauthenticated request with 401', async () => {
      const res = await request(app).get('/api/user/credits');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized user');
    });

    it('POST /api/user/project should block unauthenticated creation with 401', async () => {
      const res = await request(app)
        .post('/api/user/project')
        .send({ initial_prompt: 'Create a landing page' });
      expect(res.status).toBe(401);
    });

    it('GET /api/user/project should block unauthenticated project retrieval with 401', async () => {
      const res = await request(app).get('/api/user/project');
      expect(res.status).toBe(401);
    });
  });
});
