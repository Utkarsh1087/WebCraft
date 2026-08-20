import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

export const errorRate = new Rate('errors');
export const successCounter = new Counter('successful_requests');
export const failureCounter = new Counter('failed_requests');
export const spikeLatency = new Trend('spike_latency');

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '5s', target: 10 },    // Warm baseline
        { duration: '3s', target: 300 },   // Spike up fast!
        { duration: '10s', target: 300 },  // Hold spike
        { duration: '5s', target: 10 },    // Scale down
        { duration: '5s', target: 0 },     // Recover
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.15'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const res = http.get(`${BASE_URL}/api/project/published`);
  spikeLatency.add(res.timings.duration);

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
