/**
 * Business Date Utilities for Asia/Kolkata timezone
 * Handles business date calculations independent of UTC date slicing
 */

/**
 * Get today's date in Asia/Kolkata as YYYY-MM-DD string
 * @returns {string} Business date in YYYY-MM-DD format
 */
export function getTodayBusinessDate() {
  const now = new Date();
  // Get the date components in Asia/Kolkata timezone (UTC+5:30)
  const kolkataOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const kolkataTime = new Date(now.getTime() + kolkataOffset);
  return kolkataTime.toISOString().split('T')[0];
}

/**
 * Get a business date N days ago in Asia/Kolkata
 * @param {number} daysAgo - Number of days to subtract
 * @returns {string} Business date in YYYY-MM-DD format
 */
export function getBusinessDateDaysAgo(daysAgo) {
  const today = getTodayBusinessDate();
  const todayDate = new Date(today + 'T00:00:00');
  const targetDate = new Date(todayDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return targetDate.toISOString().split('T')[0];
}

/**
 * Get a date range for the last N business days including today
 * @param {number} days - Number of days (including today)
 * @returns {{from: string, to: string}} Date range in YYYY-MM-DD format
 */
export function getBusinessDateRange(days) {
  return {
    from: getBusinessDateDaysAgo(days - 1),
    to: getTodayBusinessDate()
  };
}

/**
 * Get yesterday's business date
 * @returns {string} Yesterday's business date in YYYY-MM-DD format
 */
export function getYesterdayBusinessDate() {
  return getBusinessDateDaysAgo(1);
}

/**
 * Parse a business date string to a Date object at start of day in Asia/Kolkata
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Date} Date object at start of day in UTC
 */
export function parseBusinessDate(dateStr) {
  return new Date(dateStr + 'T00:00:00');
}

/**
 * Format a date for display
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Formatted date like "18 Nov 2026"
 */
export function formatBusinessDate(dateStr) {
  const date = parseBusinessDate(dateStr);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}