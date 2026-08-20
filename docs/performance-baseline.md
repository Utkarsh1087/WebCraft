# Performance Baseline Report — WebCraft

**Date:** 2026-08-21  
**Environment:** Node.js v22.20.0, Express 5.2.1, Prisma 7.4.0, PostgreSQL (Neon Serverless, us-east-1)  
**Testing Tool:** Grafana k6 v2.2.0  
**Test Data:** 30 website projects, multiple versions and conversations, authenticated benchmark user.

---

## 1. Executive Summary

A comprehensive performance baseline was conducted on the unoptimized WebCraft backend before any code or architectural changes. The testing revealed major throughput bottlenecks and severe latency degradation under concurrent traffic:

- Under a 100-VU read-heavy workload, **p95 latency reached 4,813.4 ms** (4.81s) with an unoptimized database query duration averaging **2,905.5 ms**.
- Under a 500-VU stress workload, latency ballooned to **12.47s average and 21.75s p95**, with throughput stalling at **17.9 req/s**.
- Under a 300-VU spike workload, latency spiked to **10.35s average and 14.82s p95**.
- Primary bottlenecks identified:
  1. Unindexed database tables causing sequential scans across `websiteProject`, `conversation`, and `version`.
  2. Unbounded query payloads (loading complete records and HTML code for all published projects without pagination or field projection).
  3. Lack of connection pooling configuration on the database adapter.
  4. Absence of caching headers or in-memory caching for repetitive public reads.

---

## 2. Baseline Benchmark Results

### 2.1 Test Suite 1: Read-Heavy Workload (`read_heavy.js`)
- **Profile:** Ramping 1 → 10 → 50 → 100 VUs over 30 seconds.
- **Endpoints Tested:** `GET /` (Sanity), `GET /api/project/published` (DB Read).

| Metric | Measured Baseline Value |
| :--- | :--- |
| **Total Requests Completed** | 1,014 requests |
| **Throughput (RPS)** | 32.31 req/sec |
| **Error Rate** | 0.00% |
| **Average Request Latency** | 1,450.00 ms (1.45 s) |
| **p50 (Median) Latency** | 233.54 ms |
| **p90 Latency** | 4,590.00 ms |
| **p95 Latency** | 4,740.00 ms (DB Read p95: 4,813.40 ms) |
| **p99 Latency** | 5,210.00 ms |
| **Maximum Latency** | 5,623.40 ms |
| **Threshold Check (`p95 < 1000ms`)** | ❌ **FAILED** (Measured 4.74s) |

---

### 2.2 Test Suite 2: Stress Workload (`stress_test.js`)
- **Profile:** Stepped ramp 10 → 50 → 100 → 250 → 500 VUs over 45 seconds.
- **Endpoint Tested:** `GET /api/project/published`.

| Metric | Measured Baseline Value |
| :--- | :--- |
| **Total Requests Completed** | 1,130 requests |
| **Throughput (RPS)** | 17.94 req/sec |
| **Error Rate** | 0.00% |
| **Average Latency** | 12,476.32 ms (12.48 s) |
| **p50 (Median) Latency** | 12,448.00 ms |
| **p90 Latency** | 21,674.44 ms |
| **p95 Latency** | 21,753.92 ms |
| **Maximum Latency** | 22,246.14 ms |
| **Throughput Degradation** | Severe queuing observed beyond 100 VUs |

---

### 2.3 Test Suite 3: Sudden Spike Workload (`spike_test.js`)
- **Profile:** 10 VUs baseline → sudden jump to 300 VUs in 3s → hold for 10s → recover to 10 VUs.
- **Endpoint Tested:** `GET /api/project/published`.

| Metric | Measured Baseline Value |
| :--- | :--- |
| **Total Requests Completed** | 578 requests |
| **Throughput (RPS)** | 18.19 req/sec |
| **Error Rate** | 0.00% |
| **Average Latency** | 10,355.44 ms (10.36 s) |
| **p50 (Median) Latency** | 12,004.54 ms |
| **p90 Latency** | 14,647.86 ms |
| **p95 Latency** | 14,825.34 ms |
| **Maximum Latency** | 15,083.82 ms |
| **Recovery Characteristics** | Handled all connections without 5xx drops, but experienced heavy latency tail during spike |

---

## 3. Resource & Environmental Limits Documented

1. **Database Roundtrip:** The database is hosted in AWS `us-east-1` (Neon), creating an unavoidable ~200-400ms base TLS network roundtrip from the local execution environment.
2. **Connection Bottleneck:** Without an explicit pool manager and query projection, 500 concurrent connections saturate available Prisma adapter workers.
3. **Payload Bloat:** `GET /api/project/published` transfers full HTML content strings (`current_code`) and joined user objects for every item, consuming ~12MB bandwidth during a 45s run.

---

## 4. Optimization Target Goals

| Target | Current Baseline | Goal for Optimized System |
| :--- | :--- | :--- |
| **p95 Latency (Cached / Fast Path)** | 4,740 ms | < 50 ms |
| **p95 Latency (DB Query Path)** | 4,813 ms | < 800 ms |
| **Throughput (RPS)** | 32.3 req/s | > 200 req/s |
| **Stress Latency @ 500 VUs** | 21,753 ms | < 2,500 ms |
| **Response Payload Size** | Full code & user dump | Lightweight projection & pagination |
