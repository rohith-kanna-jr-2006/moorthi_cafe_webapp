const DailyCounter = require('../models/DailyCounter');
const { getKolkataBusinessDate } = require('../utils/dateTime');

/**
 * Concurrency-Safe Daily Token Generator
 *
 * Uses a two-phase atomic operation to avoid the findOneAndUpdate upsert race:
 * 1. Atomically create the counter document with sequence=0 if it doesn't exist
 * 2. Atomically increment the sequence by 1 and return the result
 *
 * The compound unique index {businessDate:1, counterType:1} ensures only one
 * document exists per day+type, so concurrent operations are safe.
 */
async function getNextDailyToken(businessDate = getKolkataBusinessDate()) {
  // Phase 1: Ensure the counter document exists with an atomic insert
  // Use updateOne with upsert to create the document with sequence=0
  // This is safe because the unique index will reject duplicates
  await DailyCounter.updateOne(
    { businessDate, counterType: 'token' },
    { $setOnInsert: { sequence: 0, businessDate, counterType: 'token' } },
    { upsert: true }
  );

  // Phase 2: Atomically increment and return the new sequence value
  // At this point, the document is guaranteed to exist, so $inc is safe
  const counter = await DailyCounter.findOneAndUpdate(
    { businessDate, counterType: 'token' },
    { $inc: { sequence: 1 } },
    {
      returnDocument: 'after',
    }
  );

  return counter.sequence;
}

/**
 * Concurrency-Safe Global Order Sequence Generator
 */
async function getNextOrderSequence(businessDate = getKolkataBusinessDate()) {
  await DailyCounter.updateOne(
    { businessDate, counterType: 'order' },
    { $setOnInsert: { sequence: 0, businessDate, counterType: 'order' } },
    { upsert: true }
  );

  const counter = await DailyCounter.findOneAndUpdate(
    { businessDate, counterType: 'order' },
    { $inc: { sequence: 1 } },
    {
      returnDocument: 'after',
    }
  );

  return counter.sequence;
}

module.exports = {
  getNextDailyToken,
  getNextOrderSequence,
};
