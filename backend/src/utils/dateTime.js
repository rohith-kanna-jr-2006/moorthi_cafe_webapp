const env = require('../config/env');

const TIMEZONE = env.businessTimezone || 'Asia/Kolkata';

/**
 * Returns components of a date in the business timezone (Asia/Kolkata)
 */
function getKolkataDate(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid Date');
  }

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const partMap = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      partMap[part.type] = part.value;
    }
  }

  const businessDate = `${partMap.year}-${partMap.month}-${partMap.day}`;
  const timeString = `${partMap.hour}:${partMap.minute}`;

  return {
    year: parseInt(partMap.year, 10),
    month: parseInt(partMap.month, 10),
    day: parseInt(partMap.day, 10),
    hour: parseInt(partMap.hour, 10),
    minute: parseInt(partMap.minute, 10),
    second: parseInt(partMap.second, 10),
    businessDate,
    timeString,
  };
}

/**
 * Returns YYYY-MM-DD for the business date in Asia/Kolkata
 */
function getKolkataBusinessDate(date = new Date()) {
  return getKolkataDate(date).businessDate;
}

/**
 * Checks if a given time is within operating hours (default 06:00 to 22:30)
 */
function isWithinOperatingHours(date, openStr = env.businessOpenTime, closeStr = env.businessCloseTime) {
  const { timeString } = getKolkataDate(date);
  return timeString >= openStr && timeString <= closeStr;
}

/**
 * Validates pickup time constraints:
 * - Must be a valid date
 * - Must be at least `minPrepMinutes` in the future
 * - Must be within `maxAdvanceDays`
 * - Must fall within business operating hours
 */
function validatePickupTime(pickupAt, minPrepMinutes = env.minPreparationMinutes, maxAdvanceDays = env.maxAdvanceBookingDays) {
  const pickup = new Date(pickupAt);
  if (isNaN(pickup.getTime())) {
    return { valid: false, message: 'pickupAt must be a valid ISO date/time string' };
  }

  const now = new Date();
  const minAllowed = new Date(now.getTime() + minPrepMinutes * 60 * 1000);
  const maxAllowed = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

  if (pickup < minAllowed) {
    return {
      valid: false,
      message: `Pickup time must be at least ${minPrepMinutes} minutes in the future to allow fresh preparation`,
    };
  }

  if (pickup > maxAllowed) {
    return {
      valid: false,
      message: `Pickup time cannot be more than ${maxAdvanceDays} days in advance`,
    };
  }

  if (!isWithinOperatingHours(pickup)) {
    return {
      valid: false,
      message: `Pickup time must be within cafe operating hours (${env.businessOpenTime} to ${env.businessCloseTime} IST)`,
    };
  }

  return { valid: true, pickupDate: pickup };
}

module.exports = {
  getKolkataDate,
  getKolkataBusinessDate,
  isWithinOperatingHours,
  validatePickupTime,
};
