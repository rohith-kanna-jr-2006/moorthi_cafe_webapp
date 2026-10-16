const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer } = require('./testHelper');
const { getNextDailyToken } = require('../src/services/counterService');
const DailyCounter = require('../src/models/DailyCounter');
const { getKolkataDate, getKolkataBusinessDate } = require('../src/utils/dateTime');

before(async () => {
  await setupTestServer();
});

after(async () => {
  await DailyCounter.deleteMany({ businessDate: '2026-10-99' });
  await teardownTestServer();
});

test('1. Concurrency test: 20 simultaneous token requests produce 20 strictly distinct tokens', async () => {
  const testBusinessDate = '2026-10-99'; // isolated synthetic date

  // Fire 20 parallel atomic token increments simultaneously
  const requests = Array.from({ length: 20 }, () => getNextDailyToken(testBusinessDate));
  const results = await Promise.all(requests);

  assert.equal(results.length, 20);

  // Check uniqueness by putting all tokens into a Set
  const uniqueTokens = new Set(results);
  assert.equal(
    uniqueTokens.size,
    20,
    `All 20 simultaneous requests must receive unique tokens! Found: ${uniqueTokens.size} unique values`
  );

  // Verify they form a continuous sequence 1..20
  const sorted = [...results].sort((a, b) => a - b);
  for (let i = 0; i < 20; i++) {
    assert.equal(sorted[i], i + 1, `Token at index ${i} should be ${i + 1}`);
  }
});

test('2. Kolkata business date boundary test: Token restarts at 1 on a new business date', async () => {
  const day1 = '2026-11-01';
  const day2 = '2026-11-02';

  const tokenDay1_first = await getNextDailyToken(day1);
  const tokenDay1_second = await getNextDailyToken(day1);
  assert.equal(tokenDay1_first, 1);
  assert.equal(tokenDay1_second, 2);

  // When next day starts at 00:00 Kolkata, token must restart at 1
  const tokenDay2_first = await getNextDailyToken(day2);
  assert.equal(tokenDay2_first, 1, 'Token must reset to 1 on the next business date in Kolkata');

  // Clean up synthetic dates
  await DailyCounter.deleteMany({ businessDate: { $in: [day1, day2] } });
});

test('3. getKolkataBusinessDate correctly converts UTC timestamps to Asia/Kolkata date', () => {
  // 2026-10-15 19:00:00 UTC is 2026-10-16 00:30:00 in IST (+05:30)
  const lateUtc = new Date('2026-10-15T19:00:00Z');
  const kolkataDate = getKolkataBusinessDate(lateUtc);
  assert.equal(kolkataDate, '2026-10-16', 'Late night UTC must roll over to the next day in IST (+05:30)');
});
