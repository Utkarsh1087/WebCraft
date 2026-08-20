# Production Readiness Audit — WebCraft

**Date:** 2026-08-21  
**Project:** WebCraft (Full-Stack AI Website Generator)  
**Auditor:** Platform & Performance Engineering  

---

## 1. Executive Summary

WebCraft is a full-stack web application designed for AI-driven website creation and revision. The backend is built with Express (TypeScript), Prisma ORM, PostgreSQL (Neon), and Better-Auth, interfacing with OpenRouter AI models (`kwaipilot/kat-coder-pro`). The frontend is a React 19 SPA built with Vite and Tailwind CSS.

While the core functionality is clean and functional for single-user prototyping, the system currently lacks critical production-grade safeguards. Under concurrent load and real-world production environments, the system faces severe risks including connection pool exhaustion, unindexed database full-table scans, memory exhaustion via 50MB request payloads, unhandled background job failures, absence of rate limiting, and missing observability.

---

## 2. Current Architecture Overview

```
                        +----------------------------+
                        |  React 19 + Vite Frontend  |
                        | (Tailwind CSS, BetterAuth) |
                        +--------------+-------------+
                                       |
                             HTTPS / JSON REST
                                       |
                        +--------------v-------------+
                        |   Express 5 TypeScript API |
                        |    (Node.js v22 Runtime)   |
                        +-------+--------------+-----+
                                |              |
                     Better-Auth / Prisma    OpenRouter AI API
                                |        (kat-coder-pro)
                        +-------v-------------+
                        |  PostgreSQL Database|
                        | (Neon Serverless DB)|
                        +---------------------+
```

### Components & Entry Points:
- **Backend Entry**: `server/server.ts` running on port 3000.
- **Auth Engine**: Better-Auth mounted at `/api/auth/*` with Prisma adapter.
- **Database Layer**: Prisma 7.4.0 utilizing `@prisma/adapter-pg` driver adapter.
- **AI Integration**: OpenAI SDK configured with OpenRouter endpoint (`configs/openai.ts`).
- **Core Routes**:
  - `/api/user/*`: Credits, project creation, user project listing, toggle publish.
  - `/api/project/*`: Revisions, code save, version rollback, deletion, project preview, published projects.

---

## 3. Detailed Audit Findings by Area

### 3.1 Security & Access Control
| Finding | Severity | Description & Impact |
| :--- | :--- | :--- |
| **50MB Request Body Limit** | **Critical** | `express.json({ limit: '50mb' })` is applied globally. Attackers can stream large payloads concurrently to exhaust Node.js heap memory, resulting in Denial of Service (DoS). |
| **Missing Rate Limiting** | **Critical** | Zero rate limiting on authentication routes or AI creation/revision endpoints. Attackers can trigger costly AI API calls and brute-force auth. |
| **Sensitive Data Exposure in Published Projects** | **High** | `getPublishedProjects` queries `include: { user: true }`, returning full User records (including potential internal metadata and emails) to unauthenticated callers. |
| **Missing Security Headers & Express Fingerprint** | **Medium** | Missing `helmet` security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`). Express signature `X-Powered-By: Express` is exposed. |
| **Internal Error Message Leakage** | **Medium** | Handlers catch errors and return `res.status(500).json({ message: error.message })`, exposing internal stack traces, DB schema names, and connection strings to clients. |
| **Missing Input Validation Schemas** | **High** | Route handlers lack strict schema validation (e.g. Zod). Missing or invalid payload keys trigger unhandled runtime exceptions. |

### 3.2 Database Performance & Scaling
| Finding | Severity | Description & Impact |
| :--- | :--- | :--- |
| **Missing Foreign Key & Filter Indexes** | **Critical** | `WebsiteProject` lacks indexes on `userId` and `isPublished`. `Conversation` and `Version` lack indexes on `projectId` and `timestamp`. Every project retrieval, version list, or public feed triggers a sequential table scan ($O(N)$). |
| **Unbounded Query Payloads & Missing Pagination** | **High** | `getPublishedProjects` and `getUserProjects` fetch all records without `limit`, `offset`, or cursor pagination. As data grows, this leads to massive payload sizes and high memory consumption. |
| **Unconfigured Connection Pool** | **High** | `PrismaPg` adapter is instantiated with default unmanaged connection settings. Rapid bursts of concurrent requests can exhaust Neon PostgreSQL connection limits. |
| **Non-Atomic Credit Decrement & Race Conditions** | **Medium** | Credit check and decrement are separate database operations without transactions. Concurrent requests can bypass credit balance checks. |

### 3.3 Concurrency & Background Processing
| Finding | Severity | Description & Impact |
| :--- | :--- | :--- |
| **Floating Fire-and-Forget AI Promises** | **High** | `createUserProject` executes background AI generation inside an unhandled floating async IIFE without a controlled queue or concurrency limiter. A process restart loses all in-flight jobs. |
| **Synchronous Long-Running AI in Revision Route** | **High** | `makeRevision` blocks the client HTTP request while awaiting two sequential OpenAI calls (10–30+ seconds), saturating HTTP connection slots. |

### 3.4 Observability & Reliability
| Finding | Severity | Description & Impact |
| :--- | :--- | :--- |
| **Synchronous `console.log` Logging** | **Medium** | `req.method req.url` logging uses synchronous `console.log`, adding event-loop blocking under high throughput. |
| **No Request Tracing or Correlation IDs** | **Medium** | No `X-Request-Id` headers or structured log context, making debugging multi-step flows impossible in production. |
| **Missing Health & Readiness Probes** | **High** | No `/health`, `/live`, or `/ready` endpoints with database liveness checks for load balancers or orchestrators. |
| **Missing Prometheus Metrics** | **Medium** | No telemetry on request rates, latency percentiles, error status codes, or active database connections. |
| **No Graceful Shutdown Handler** | **Medium** | Server lacks `SIGTERM`/`SIGINT` handling to safely close DB pools, finish inflight HTTP requests, and terminate cleanly. |

### 3.5 Containerization & Operations
| Finding | Severity | Description & Impact |
| :--- | :--- | :--- |
| **Missing Production Docker Setup** | **Medium** | No multi-stage `Dockerfile`, `.dockerignore`, or `docker-compose.yml` for reproducible production deployment. |
| **Windows Event Loop Hack in Codebase** | **Low** | `setInterval(() => {}, 1000 * 60 * 60)` in `server.ts` left in production path. |

---

## 4. Prioritized Action Matrix

| Priority | Area | Action Item |
| :--- | :--- | :--- |
| **CRITICAL** | Security | Implement global & route-level Rate Limiting (`express-rate-limit`). |
| **CRITICAL** | Security | Restrict body size limit from 50MB to appropriate tier (1MB default, 5MB max for code saves). |
| **CRITICAL** | Database | Add composite & foreign key indexes to `schema.prisma` (`userId`, `isPublished`, `projectId`, `timestamp`). |
| **HIGH** | Database | Configure PostgreSQL connection pool parameters (max connections, timeout, idle). |
| **HIGH** | Database | Implement cursor/offset pagination and selective field projections (`select`) on list endpoints. |
| **HIGH** | Security | Add `helmet`, sanitize CORS configuration, and prevent User PII exposure in public endpoints. |
| **HIGH** | Observability | Implement structured logging (`pino` / `pino-http`), `X-Request-ID`, and `/healthz` + `/readyz` probes. |
| **HIGH** | Reliability | Implement centralized error handling middleware and graceful shutdown lifecycle. |
| **HIGH** | Validation | Implement Zod schema validation middleware for all request payloads and params. |
| **MEDIUM** | Performance | Implement in-memory / cache headers for public projects and health checks. |
| **MEDIUM** | Observability | Implement Prometheus metrics endpoint (`/metrics`) using `prom-client`. |
| **MEDIUM** | DevOps | Create multi-stage production Dockerfile and Docker Compose environment. |
| **LOW** | Code Cleanliness | Remove platform-specific workarounds and standardize TypeScript compilation. |

---

## 5. Audit Conclusion

The WebCraft backend has a solid architectural core but requires modernization across database indexing, security boundaries, rate limiting, request validation, observability, and connection management before it can be deemed production-ready.
