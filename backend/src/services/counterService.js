const DailyCounter = require('../models/DailyCounter');
const { getKolkataBusinessDate } = require('../utils/dateTime');

/**
 * Concurrency-Safe Daily Token Generator
 * - Uses atomic MongoDB $inc operation with upsert: true
 * - Compound unique index guarantees token restarts at 1 each day in Asia/Kolkata
 * - Two simultaneous requests will always receive distinct sequential integers
 */
async function getNextDailyToken(businessDate = getKolkataBusinessDate()) {
  const counter = await DailyCounter.findOneAndUpdate(
    { businessDate, counterType: 'token' },
    { $inc: { sequence: 1 } },
    {
      returnDocument: 'after',
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return counter.sequence;
}

/**
 * Concurrency-Safe Global Order Sequence Generator
 */
async function getNextOrderSequence(businessDate = getKolkataBusinessDate()) {
  const counter = await DailyCounter.findOneAndUpdate(
    { businessDate, counterType: 'order' },
    { $inc: { sequence: 1 } },
    {
      returnDocument: 'after',
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return counter.sequence;
}

module.exports = {
  getNextDailyToken,
  getNextOrderSequence,
};
