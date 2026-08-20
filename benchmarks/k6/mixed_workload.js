import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const successCounter = new Counter('successful_requests');
export const failureCounter = new Counter('failed_requests');

export const options = {
  scenarios: {
    mixed: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '5s', target: 20 },
        { duration: '15s', target: 50 },
        { duration: '5s', target: 0 },
      ],
    },
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // 1. Root health
  const root = http.get(`${BASE_URL}/`);
  check(root, { 'root 200': (r) => r.status === 200 });

  // 2. Public projects list
  const pub = http.get(`${BASE_URL}/api/project/published`);
  check(pub, { 'published 200': (r) => r.status === 200 });

  // 3. Project detail preview (existing vs non-existing)
  const projDetail = http.get(`${BASE_URL}/api/project/published/bench-proj-2`);
  check(projDetail, { 'detail 200': (r) => r.status === 200 || r.status === 404 });

  // 4. Non-existing 404 check
  const notFound = http.get(`${BASE_URL}/api/project/published/non-existent-id-999`);
  check(notFound, { 'not found 404': (r) => r.status === 404 });

  sleep(0.1);
}
