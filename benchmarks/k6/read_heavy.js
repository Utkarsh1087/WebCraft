import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const successCounter = new Counter('successful_requests');
export const failureCounter = new Counter('failed_requests');
export const readLatency = new Trend('read_duration');

export const options = {
  scenarios: {
    read_heavy: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '5s', target: 10 },
        { duration: '10s', target: 50 },
        { duration: '10s', target: 100 },
        { duration: '5s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // less than 5% errors
    http_req_duration: ['p(95)<1000'], // 95% of requests under 1s
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test root health
  const rootRes = http.get(`${BASE_URL}/`);
  const rootOk = check(rootRes, {
    'root status is 200': (r) => r.status === 200,
  });

  if (rootOk) {
    successCounter.add(1);
    errorRate.add(0);
  } else {
    failureCounter.add(1);
    errorRate.add(1);
  }

  // Test published projects read
  const pubRes = http.get(`${BASE_URL}/api/project/published`);
  readLatency.add(pubRes.timings.duration);

  const pubOk = check(pubRes, {
    'published projects status is 200': (r) => r.status === 200,
  });

  if (pubOk) {
    successCounter.add(1);
    errorRate.add(0);
  } else {
    failureCounter.add(1);
    errorRate.add(1);
  }

  sleep(0.1);
}
