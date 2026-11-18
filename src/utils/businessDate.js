/**
 * Business Date Utilities for Asia/Kolkata timezone
 *
 * Uses pure calendar-day arithmetic on YYYY-MM-DD strings.
 * No local-timezone or UTC conversion is performed on business dates,
 * so results are identical regardless of the runtime/browser timezone.
 */

const KOLKATA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Read the Asia/Kolkata calendar date components from a UTC instant.
 * @param {Date} date
 * @returns {{year:number, month:number, date:number}}
 */
function getKolkataDateComponents(date) {
  const shifted = new Date(date.getTime() + KOLKATA_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1, // 1-based
    date: shifted.getUTCDate(),
  };
}

/**
 * Format year/month/date numbers as a YYYY-MM-DD string.
 * @param {number} year
 * @param {number} month 1-based
 * @param {number} date
 * @returns {string}
 */
function isoFromComponents(year, month, date) {
  const mm = String(month).padStart(2, '0');
  const dd = String(date).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

/**
 * Get today's date in Asia/Kolkata as YYYY-MM-DD string
 * @returns {string} Business date in YYYY-MM-DD format
 */
export function getTodayBusinessDate() {
  const { year, month, date } = getKolkataDateComponents(new Date());
  return isoFromComponents(year, month, date);
}

/**
 * Add or subtract calendar days from a YYYY-MM-DD business date string.
 * Pure calendar arithmetic — no timezone conversion.
 * @param {string} dateStr - Business date in YYYY-MM-DD format
 * @param {number} days - Number of days to add (negative to subtract)
 * @returns {string} Resulting business date in YYYY-MM-DD format
 */
export function addBusinessDays(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  // Use UTC midnight as a pure calendar counter; the input string is
  // already an Asia/Kolkata business date, so we treat it as a calendar
  // date without shifting by any local timezone.
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return isoFromComponents(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/**
 * Get a business date N days ago in Asia/Kolkata
 * @param {number} daysAgo - Number of days to subtract
 * @returns {string} Business date in YYYY-MM-DD format
 */
export function getBusinessDateDaysAgo(daysAgo) {
  return addBusinessDays(getTodayBusinessDate(), -daysAgo);
}

/**
 * Get a date range for the last N business days including today
 * @param {number} days - Number of days (including today)
 * @returns {{from: string, to: string}} Date range in YYYY-MM-DD format
 */
export function getBusinessDateRange(days) {
  return {
    from: getBusinessDateDaysAgo(days - 1),
    to: getTodayBusinessDate(),
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
 * Parse a business date string to a Date object at UTC midnight.
 * Using Date.UTC avoids browser-local-timezone shifts.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {Date} Date object at UTC midnight
 */
export function parseBusinessDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Format a business date string for display.
 * Reads directly from the YYYY-MM-DD string — no Date object, no timezone.
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @returns {string} Formatted date like "18 Nov 2026"
 */
export function formatBusinessDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${String(d).padStart(2, '0')} ${months[m - 1]} ${y}`;
}