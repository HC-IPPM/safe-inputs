#!/usr/bin/env node
const { setTimeout } = require('node:timers/promises');

const retry_max = 30;
const timeout_seconds = 5;
const endpoint = process.argv[2];

if (endpoint === undefined) {
  throw new Error(
    'wait_for_service.cjs requires one argument, the endpoint URL to wait for.',
  );
}

const try_fetch = (retry_count) =>
  fetch(endpoint)
    .then(({ status }) => {
      if (status === 200) {
        console.log(`Service at ${endpoint} responded successfully!`);
        process.exit(0);
      } else if (retry_count >= retry_max) {
        console.log(`Service at ${endpoint} took too long, out of retries!`);
        process.exit(1);
      } else {
        console.log(`Service at ${endpoint} response pending...`);
        return setTimeout(timeout_seconds * 1000).then(() =>
          try_fetch(retry_count + 1),
        );
      }
    })
    .catch((error) => {
      if (retry_count < retry_max) {
        console.log(`Service at ${endpoint} response pending...`);
        return setTimeout(timeout_seconds * 1000).then(() =>
          try_fetch(retry_count + 1),
        );
      } else {
        throw error;
      }
    });

try_fetch(0);
