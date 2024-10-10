#!/usr/bin/env node
const { setTimeout } = require('node:timers/promises');

const retry_max = 8;
const endpoint =
  process.env.GRAPHQL_ENDPOINT_URL ?? 'http://localhost:3000/api/graphql';

const try_fetch = (retry_count) =>
  fetch(endpoint)
    .then(({ status }) => {
      if (status === 200) {
        console.log('Api service responded successfully!');
        process.exit(0);
      } else if (retry_count >= retry_max) {
        console.log('Api service took too long, out of retries!');
        process.exit(1);
      } else {
        console.log('Api service response pending...');
        return setTimeout(2000).then(() => try_fetch(retry_count + 1));
      }
    })
    .catch((error) => {
      if (retry_count < retry_max) {
        console.log('Api service response pending...');
        return setTimeout(2000).then(() => try_fetch(retry_count + 1));
      } else {
        throw error;
      }
    });

try_fetch(0);
