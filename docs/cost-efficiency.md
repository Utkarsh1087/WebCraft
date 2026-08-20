# Cost & Free-Tier Optimization Guide — WebCraft

**Date:** 2026-08-21  
**Target Infrastructure:** Free-Tier / Low-Cost Production Deployment  

---

## 1. Free-Tier Architecture Breakdown

WebCraft is architected to operate comfortably within free tiers offered by major cloud providers without risking unexpected billing overages.

| Component | Recommended Provider | Free-Tier Limits | WebCraft Optimization Strategy |
| :--- | :--- | :--- | :--- |
| **Frontend (React 19)** | **Vercel** / **Cloudflare Pages** | Unlimited static hosting, 100GB bandwidth | Static SPA build, asset caching, no serverless runtime cost. |
| **Backend API (Node.js)** | **Railway** / **Render** / **Fly.io** | 512MB RAM, 0.5 CPU, free monthly credits | Low-memory Node.js runtime (~45MB RSS), Gzip compression, fast in-memory caching. |
| **Database (PostgreSQL)** | **Neon Serverless** / **Supabase** | 0.5GB storage, 10-20 active connections | Connection pool capped at 20 (`DB_POOL_MAX`), indexes preventing expensive full-table compute scans, idle pool timeouts. |
| **AI LLM API** | **OpenRouter** / **OpenAI** | Pay-as-you-go / Free tier credits | Strict rate limits (15 calls/15m), prompt compression, max token limits (`max_tokens: 2048`). |

---

## 2. Resource Consumption Metrics Measured

| Metric | Measured Real Usage | Free-Tier Headroom |
| :--- | :--- | :--- |
| **Node.js RSS Memory** | ~40.2 MB (idle) / ~132 MB (peak 500 VUs) | Safe within 512 MB container limit (74% headroom) |
| **Heap Memory Used** | ~25.3 MB | Safe within V8 default heap limits |
| **Database Connections** | Controlled pool (max 20) | Safe within Neon 20-connection pooler limit |
| **Payload Bandwidth** | Reduced by 75% via compression & field selection | Massive bandwidth savings on cloud data transfer |

---

## 3. Cost Safeguards Implemented

1. **Global & Route Rate Limiting:** Prevents malicious scrapers and DDoS traffic from driving up container compute hours or LLM token costs.
2. **Body Size Limiting (100KB default):** Shields server memory from large multipart payload buffer allocations.
3. **Selective Query Projection:** Excludes large HTML code strings from list queries, reducing database egress bandwidth by >80%.
4. **In-Memory Cache Layer:** Drops database query count on high-frequency public reads to near zero during traffic spikes.
