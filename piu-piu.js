const axios = require('axios');
const assert = require('assert');
const { printTable } = require('console-table-printer');

const { CONNECTIONS_COUNT, TARGETS, REFRESH_RATE } = process.env;

assert.match(CONNECTIONS_COUNT, /\d+/g, `"CONNECTIONS_COUNT" should be integer, but was: "${CONNECTIONS_COUNT}"`);
assert.match(REFRESH_RATE, /\d+/g, `"REFRESH_RATE" should be integer, but was: "${REFRESH_RATE}"`);
assert.match(TARGETS, /\w+/g, `"CONNECTIONS_COUNT" should be integer, but was: "${CONNECTIONS_COUNT}"`);

const count = parseInt(CONNECTIONS_COUNT, 10);
const refreshRate = parseInt(REFRESH_RATE, 10);
const targets = TARGETS.split(',')
  .map((it) => it.trim())
  .filter((it) => !!it);

const createCircQueue = (capacity) => {
  const storage = [];
  const push = (it) => {
    if (storage.length >= capacity) {
      storage.shift();
    }
    storage.push(it);
  };
  return { push, storage };
};

const msToSec = (ms) => Math.round(ms / 1000);

const requestsData = targets
  .map((url) => ({ [url]: { success: 0, errors: 0, timings: createCircQueue(100), currentState: '' } }))
  .reduce((it, acc) => ({ ...acc, ...it }), {});

const startRequest = async (url) => {
  const data = requestsData[url];
  const start = Date.now();
  try {
    await axios({ method: 'GET', url });
    const data = requestsData[url];
    data.success = data.success + 1;
  } catch (error) {
    data.errors = data.errors + 1;
    data.lastError = error.message;
  }
  data.timings.push(msToSec(Date.now() - start));
  return startRequest(url);
};

(async () => {
  const start = Date.now();
  for (const url of targets) {
    Array(count)
      .fill('')
      .forEach(() => startRequest(url));
  }

  setInterval(() => {
    const table = Object.entries(requestsData).map(([url, { success, errors, timings, lastError }]) => {
      const avgTime =
        Math.round((timings.storage.reduce((it, acc) => it + acc, 0) / timings.storage.length) * 100) / 100;
      return {
        Url: url,
        'Success responses count': success,
        'Error responses count': errors,
        'Latest error': lastError,
        'Average response time (sec)': avgTime,
      };
    });
    process.stdout.cursorTo(0, 0, () =>
      process.stdout.clearScreenDown(() => {
        printTable(table);
        process.stdout.write(`Time since script started: ${msToSec(Date.now() - start)}sec`);
      })
    );
  }, refreshRate);
})();
