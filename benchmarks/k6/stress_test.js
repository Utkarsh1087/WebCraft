import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const successCounter = new Counter('successful_requests');
export const failureCounter = new Counter('failed_requests');
export const reqLatency = new Trend('request_latency');

export const options = {
  scenarios: {
    stress_ramp: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '5s', target: 10 },
        { duration: '5s', target: 50 },
        { duration: '10s', target: 100 },
        { duration: '10s', target: 250 },
        { duration: '10s', target: 500 },
        { duration: '5s', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/project/published`);
  reqLatency.add(res.timings.duration);

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

  sleep(0.05);
}
