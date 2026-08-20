import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const successCounter = new Counter('successful_requests');
export const failureCounter = new Counter('failed_requests');
export const soakLatency = new Trend('soak_latency');

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-vus',
      vus: 30,
      duration: '45s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<1500'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/project/published`);
  soakLatency.add(res.timings.duration);

  const ok = check(res, {
    'status is 200': (r) => r.status === 200,
  });

  if (ok) {
    successCounter.add(1);
    errorRate.add(0);
  } else {
    failureCounter.add(1);
    errorRate.add(1);
  }

  sleep(0.1);
}
