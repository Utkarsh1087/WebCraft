# WebCraft ⚡

<div align="center">

![WebCraft Banner](https://res.cloudinary.com/deuiyparu/image/upload/v1787264165/webcraft_preview.png)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5.2-black.svg?logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4-2D3748.svg?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**An enterprise-grade, high-performance AI website generator and live customization studio.**

[Live Demo](http://localhost:5173) • [API Documentation](#api-endpoints) • [Benchmark Reports](./docs/performance-results.md)

</div>

---

## 🌟 Highlights & Key Features

- ⚡ **AI-Powered Website Generation**: Describe any web application or landing page and get an interactive, responsive Tailwind CSS website in seconds.
- 🎨 **Live Studio Workspace**: Real-time iframe preview sandbox with responsive device toggles (Phone, Tablet, Desktop).
- 💬 **Iterative AI Revisions & Chat**: Converse with the AI to refine components, change layouts, tweak color palettes, and add animations.
- 🕒 **Version History & Instant Rollback**: Automated point-in-time code snapshots with 1-click version rollbacks.
- 🚀 **1-Click Publishing & Community Gallery**: Publish creations to a public community showcase or download complete standalone HTML bundles.
- 🛡️ **Zero-Downtime Multi-Model Resilience**: Dual-engine AI adapter supporting Google Gemini REST API and OpenRouter with automatic dynamic fallback generation.

---

## 📊 Verified Production Benchmarks

WebCraft was rigorously audited, hardened, and benchmarked using **k6 v0.57.0** on PostgreSQL under staged loads from 10 to 500 concurrent virtual users (VUs):

| Workload / Metric | Baseline | Production Hardened | Improvement |
| :--- | :--- | :--- | :--- |
| **Read-Heavy p50 Latency** | `483.00 ms` | **`0.86 ms`** | **-99.82%** (561x faster) |
| **Read-Heavy p95 Latency** | `4,740.00 ms` | **`2.12 ms`** | **-99.95%** (2,235x faster) |
| **Read-Heavy p99 Latency** | `5,410.00 ms` | **`7.57 ms`** | **-99.86%** (714x faster) |
| **Peak Sustained Throughput** | `17.9 req/s` | **`2,017.7 req/s`** | **+11,172%** (112x throughput) |
| **Concurrent Virtual Users** | 100 VUs *(failed)* | **500 Concurrent VUs** | **5x concurrent scale** |
| **Error Rate under Load** | `14.2%` | **`0.00%`** | **100% error elimination** |
| **Memory Soak Test** | Unbounded growth | **0 KB leak (flat heap)** | **Completely stable** |

> 📖 *Check out the complete benchmark breakdown in [docs/performance-results.md](./docs/performance-results.md).*

---

## 🏗️ Architecture & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                 React 19 SPA (Vite + Tailwind v4)           │
│         Interactive Studio Canvas + Iframe Sandbox          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                  Express 5.2.1 REST API                     │
│  - Helmet Security & CORS       - In-Memory TTL Cache       │
│  - Multi-Tier Rate Limiting     - Prometheus Telemetry      │
│  - Zod Schema Validation        - Pino Structured Logging   │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼───────────────┐
│     PostgreSQL + Prisma     ││   Resilient AI Service Engine│
│ - pg.Pool Connection Manager││ - Google Gemini REST API     │
│ - Composite B-Tree Indexes  ││ - OpenRouter Models          │
│ - Zero Data Leaks (No PII)  ││ - Dynamic Fallback Generator │
└─────────────────────────────┘└──────────────────────────────┘
```

---

## 🔒 Security Hardening

- **IDOR Protection**: Strict tenant isolation across all projects, revisions, code saves, and deletions.
- **Data Protection & Zero PII Exposure**: Public gallery endpoints use strict field projection to omit user emails and metadata.
- **Multi-Tier Rate Limiting**: Separate limits for authentication (`/api/auth/*`), AI generation (`/api/user/project`), and global API traffic.
- **Input Validation**: 100% of request bodies, parameters, and query strings validated with strict Zod schemas.
- **HTTP Header Armor**: Integrated `helmet()` with `HSTS`, `X-Content-Type-Options: nosniff`, and removed server fingerprinting.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js >= 20.x
- PostgreSQL database (Local or hosted via Neon / Supabase)

### 1. Clone & Install
```bash
git clone https://github.com/Utkarsh1087/WebCraft.git
cd WebCraft
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure DATABASE_URL and AI_API_KEY in .env
npx prisma db push
npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

Visit **`http://localhost:5173`** to access WebCraft!

---

## 🐳 Docker Deployment

To launch the full production stack with containerized health checks:

```bash
docker-compose up --build -d
```

Verify backend health:
```bash
curl http://localhost:3000/healthz   # Liveness Probe
curl http://localhost:3000/readyz    # Database Readiness Probe
curl http://localhost:3000/metrics   # Prometheus Telemetry
```

---

## 🧪 Automated Testing & Benchmarking

```bash
# Run unit & API integration tests (15/15 passing)
cd server
npm test

# Run k6 load benchmark suites
k6 run benchmarks/k6/read_heavy.js
k6 run benchmarks/k6/stress_test.js
k6 run benchmarks/k6/spike_test.js
k6 run benchmarks/k6/soak_test.js
```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/healthz` | Liveness health probe | No |
| `GET` | `/readyz` | Database readiness check | No |
| `GET` | `/metrics` | Prometheus telemetry metrics | No |
| `GET` | `/api/project/published` | Paginated public community gallery | No |
| `GET` | `/api/project/preview/:projectId` | View published project code & assets | No |
| `POST` | `/api/user/project` | Generate new website from text prompt | **Yes** |
| `GET` | `/api/user/projects` | Fetch authenticated user projects | **Yes** |
| `GET` | `/api/user/project/:projectId` | Fetch single project workspace details | **Yes** |
| `PUT` | `/api/project/save/:projectId` | Save modified HTML code | **Yes** |
| `POST` | `/api/project/revision/:projectId`| Request AI website revision | **Yes** |
| `POST` | `/api/user/project/publish/:projectId` | Toggle public/private visibility | **Yes** |

---

## 💬 Dad Joke of the Day

> **Why do programmers prefer dark mode?**  
> *Because light attracts bugs!* 🐛💡

---

## 📝 Personal Note

Building **WebCraft** has been an exhilarating journey in combining cutting-edge generative AI with hardcore backend reliability, distributed systems thinking, and fluid frontend UX. 

Whether you're building a developer portfolio, a SaaS landing page, or prototyping your next startup idea, I hope WebCraft empowers you to create something extraordinary with zero friction.

If you find this project helpful or inspiring, feel free to give it a ⭐ on GitHub and share your thoughts!

— **Utkarsh Rajput** ([@Utkarsh1087](https://github.com/Utkarsh1087))

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
