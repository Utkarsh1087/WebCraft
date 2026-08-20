# Security Audit & Risk Assessment — WebCraft

**Date:** 2026-08-21  
**Target:** WebCraft Backend & Authentication Services  
**Assessment Type:** Production-Grade Security Review & Dependency Vulnerability Scan  

---

## 1. Classification Overview

| Severity | Count | Summary |
| :--- | :--- | :--- |
| **CRITICAL** | 2 | Global 50MB request payload DoS, Missing rate limiting on costly/auth endpoints |
| **HIGH** | 4 | PII exposure on public project endpoints, Missing input schema validation, Dependency ReDoS/Injection risks in indirect sub-packages, Open CORS fallback |
| **MEDIUM** | 3 | Sensitive error trace leakage in API responses, Missing Helmet HTTP security headers, Express fingerprint disclosure |
| **LOW** | 2 | Loose cookie attributes in local dev, Lack of request correlation IDs |
| **INFORMATIONAL**| 2 | OpenRouter AI token handling in server runtime, Missing Content-Security-Policy |

---

## 2. Findings & Vulnerability Matrix

### 2.1 [CRITICAL] SEC-01: Global 50MB Request Body Limit (DoS / Memory Exhaustion)
- **Location:** `server/server.ts` line 28 (`app.use(express.json({ limit: '50mb' }))`)
- **Risk:** Any unauthenticated client can stream concurrent 50MB payloads, causing Node.js V8 heap memory exhaustion and crashing the API process.
- **Remediation:** 
  1. Reduce global JSON parser limit to `100kb` for standard API requests.
  2. Apply a specialized `2mb` limit strictly on code saving routes (`/api/project/save/:projectId`).

### 2.2 [CRITICAL] SEC-02: Missing API Rate Limiting (Brute-Force & AI Quota Depletion)
- **Location:** All routes (`/api/auth/*`, `/api/user/*`, `/api/project/*`)
- **Risk:** Attackers can spam project creation or revision endpoints, depleting AI API credits and exhausting database connections. Better-Auth endpoints are exposed to brute-force credential stuffing.
- **Remediation:**
  1. Add `express-rate-limit` with standard tier (100 req/15 min) for public read APIs.
  2. Add strict tier (10 req/15 min) for AI generation and project creation routes.
  3. Add auth tier (20 req/15 min) for authentication endpoints.

### 2.3 [HIGH] SEC-03: PII & Sensitive Account Exposure in Public Project Feeds
- **Location:** `server/controllers/projectController.ts` in `getPublishedProjects` (`include: { user: true }`)
- **Risk:** Calling `GET /api/project/published` returns full user records, exposing email addresses, verified status, and internal metadata to anonymous users.
- **Remediation:** Use Prisma `select` projection to only expose public attributes (`id`, `name`) and omit emails/credentials.

### 2.4 [HIGH] SEC-04: Missing Input Schema Validation
- **Location:** `createUserProject`, `makeRevision`, `saveProjectCode`
- **Risk:** Unvalidated `req.body` or `req.params` (e.g. non-string `initial_prompt` or null `code`) throws runtime exceptions or crashes request flows.
- **Remediation:** Implement Zod schema validation middleware for all request payloads.

### 2.5 [MEDIUM] SEC-05: Missing Security Headers & Express Fingerprint
- **Location:** `server/server.ts`
- **Risk:** `X-Powered-By: Express` header is returned in all responses. Absence of `X-Frame-Options`, `X-Content-Type-Options`, and `HSTS` increases risk of clickjacking and MIME-sniffing.
- **Remediation:** Integrate `helmet()` middleware and disable `x-powered-by`.

### 2.6 [MEDIUM] SEC-06: Internal Error Message Exposure
- **Location:** Catch blocks in controllers (`res.status(500).json({ message: error.message })`)
- **Risk:** Internal database connection strings, table names, or OpenRouter errors are returned directly to clients.
- **Remediation:** Centralized error handler that logs full details internally and returns sanitized generic error messages (`"Internal server error"`) in production.

---

## 3. Dependency Vulnerability Assessment

- **Scan Results:** 23 vulnerabilities identified across transitive dependencies (`picomatch`, `hono`, `kysely`, `lodash`, `path-to-regexp`, `valibot`).
- **Remediation:** Run `npm audit fix` and upgrade top-level packages where possible.
