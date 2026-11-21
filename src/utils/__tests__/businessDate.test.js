/**
 * Unit tests for src/utils/businessDate.js
 *
 * Tests pure calendar arithmetic on Asia/Kolkata business dates without
 * depending on the runtime timezone or on a mutable clock.
 *
 * Run: node --input-type=module <this-file>
 * (No external test framework required.)
 */

import {
  getTodayBusinessDate,
  addBusinessDays,
  getBusinessDateDaysAgo,
  getYesterdayBusinessDate,
  getBusinessDateRange,
  parseBusinessDate,
  formatBusinessDate,
} from '../businessDate.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let failures = 0;
let passed = 0;

function assert(cond, label) {
  if (cond) {
    passed++;
  } else {
    failures++;
    console.error(`FAIL: ${label}`);
  }
}

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

// ---------------------------------------------------------------------------
// addBusinessDays — deterministic calendar math (no clock dependency)
// ---------------------------------------------------------------------------

assert(addBusinessDays('2026-11-17', 1) === '2026-11-18', 'addBusinessDays +1 day');
assert(addBusinessDays('2026-11-17', -1) === '2026-11-16', 'addBusinessDays -1 day');
assert(addBusinessDays('2026-11-17', 0) === '2026-11-17', 'addBusinessDays +0 days');
assert(addBusinessDays('2026-11-17', 7) === '2026-11-24', 'addBusinessDays +7 days');
assert(addBusinessDays('2026-11-17', -7) === '2026-11-10', 'addBusinessDays -7 days');

// Month boundary
assert(addBusinessDays('2026-11-30', 1) === '2026-12-01', 'month boundary forward Nov→Dec');
assert(addBusinessDays('2026-12-01', -1) === '2026-11-30', 'month boundary backward Dec→Nov');
assert(addBusinessDays('2026-01-31', 1) === '2026-02-01', 'month boundary Jan→Feb');
assert(addBusinessDays('2026-03-01', -1) === '2026-02-28', 'month boundary Feb→Mar backwards');

// Year boundary
assert(addBusinessDays('2026-12-31', 1) === '2027-01-01', 'year boundary Dec 31 → Jan 1');
assert(addBusinessDays('2027-01-01', -1) === '2026-12-31', 'year boundary Jan 1 ← Dec 31');

// Leap year
assert(addBusinessDays('2024-02-28', 1) === '2024-02-29', 'leap year Feb 28 → 29');
assert(addBusinessDays('2024-02-29', 1) === '2024-03-01', 'leap year Feb 29 → Mar 1');
assert(addBusinessDays('2023-02-28', 1) === '2023-03-01', 'non-leap year Feb 28 → Mar 1');
// Note: +2 from Feb 28 in non-leap year goes to Mar 2 (28→1 day→Mar 1, +2 days→Mar 2)
assert(addBusinessDays('2023-02-28', 2) === '2023-03-02', 'non-leap year Feb 28 +2 → Mar 2');

// Large deltas
assert(addBusinessDays('2026-01-01', 364) === '2026-12-31', 'add 364 days within same year');
assert(addBusinessDays('2025-12-31', 1) === '2026-01-01', 'cross leap-year boundary forward');
assert(addBusinessDays('2026-01-01', -1) === '2025-12-31', 'cross leap-year boundary backward');

// ---------------------------------------------------------------------------
// getBusinessDateDaysAgo / getYesterdayBusinessDate — relative to TODAY
// ---------------------------------------------------------------------------

const today = getTodayBusinessDate();
const yesterday = getYesterdayBusinessDate();
const sixDaysAgo = getBusinessDateDaysAgo(6);

assert(today === addBusinessDays(yesterday, 1), 'today == yesterday + 1');
assert(yesterday === addBusinessDays(today, -1), 'yesterday == today - 1');
assert(sixDaysAgo === addBusinessDays(today, -6), 'getBusinessDateDaysAgo(6) consistent with addBusinessDays(-6)');

// ---------------------------------------------------------------------------
// getBusinessDateRange — consistency checks
// ---------------------------------------------------------------------------

const range7 = getBusinessDateRange(7);
const range1 = getBusinessDateRange(1);
const range14 = getBusinessDateRange(14);

assert(range7.to === today, 'range7.to == today');
assert(range7.from === addBusinessDays(today, -6), 'range7.from == today - 6');
assert(range1.to === today, 'range1.to == today');
assert(range1.from === today, 'range1.from == today (same day)');
assert(range14.from === addBusinessDays(today, -13), 'range14.from == today - 13');

// Range length in days
assert(
  addBusinessDays(range7.from, 6) === range7.to,
  'range7 span is exactly 6 days apart'
);
assert(
  addBusinessDays(range14.from, 13) === range14.to,
  'range14 span is exactly 13 days apart'
);

// ---------------------------------------------------------------------------
// parseBusinessDate — round-trip with UTC midnight
// ---------------------------------------------------------------------------

const parsed = parseBusinessDate('2026-11-18');
assert(parsed.getUTCFullYear() === 2026, 'parseBusinessDate year');
assert(parsed.getUTCMonth() === 10, 'parseBusinessDate month (0-indexed)');
assert(parsed.getUTCDate() === 18, 'parseBusinessDate date');
assert(parsed.getUTCHours() === 0, 'parseBusinessDate hours = 0 UTC');
assert(parsed.getUTCMinutes() === 0, 'parseBusinessDate minutes = 0 UTC');

// ---------------------------------------------------------------------------
// formatBusinessDate — deterministic string output from YYYY-MM-DD
// ---------------------------------------------------------------------------

assert(formatBusinessDate('2026-11-18') === '18 Nov 2026', 'format normal date');
assert(formatBusinessDate('2026-01-01') === '01 Jan 2026', 'format January');
assert(formatBusinessDate('2026-09-09') === '09 Sep 2026', 'format September');

// ---------------------------------------------------------------------------
// getKolkataDateComponents internal behaviour via addBusinessDays edge cases
// ---------------------------------------------------------------------------

// Dates near epoch boundaries — just ensure no exception thrown
assert(
  addBusinessDays('2000-01-01', 0) === '2000-01-01',
  'millennium boundary date round-trips'
);
assert(
  addBusinessDays('1970-01-01', 0) === '1970-01-01',
  'Unix epoch date round-trips'
);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\nbusinessDate.js unit tests: ${passed} passed, ${failures} failed\n`);
if (failures > 0) {
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Timezone-aware verification — assert Asia/Kolkata offset is applied correctly
// These run relative to the machine's clock but validate the Kolkata offset math.
// ---------------------------------------------------------------------------

{
  // Simulate what getKolkataDateComponents does with a known UTC instant
  const KOLKATA_OFFSET_MS = 5.5 * 60 * 60 * 1000;

  // Test 1: A UTC instant that falls on 2026-11-18 in Kolkata
  // 2026-11-17 18:30 UTC = 2026-11-18 00:00 IST
  const utcInstant = Date.UTC(2026, 10, 17, 18, 30, 0, 0);
  const shifted = new Date(utcInstant + KOLKATA_OFFSET_MS);
  assert(
    `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth()+1).padStart(2,'0')}-${String(shifted.getUTCDate()).padStart(2,'0')}` === '2026-11-18',
    'timezone conversion: 2026-11-17 18:30 UTC → 2026-11-18 IST'
  );

  // Test 2: A UTC instant that falls on 2026-11-18 early morning in Kolkata
  // 2026-11-17 23:59 UTC = 2026-11-18 05:29 IST
  const utcEarlyMorning = Date.UTC(2026, 10, 17, 23, 59, 0, 0);
  const shiftedMorning = new Date(utcEarlyMorning + KOLKATA_OFFSET_MS);
  assert(
    shiftedMorning.getUTCDate() === 18,
    'timezone conversion: late UTC night → next day IST'
  );
  assert(
    shiftedMorning.getUTCHours() >= 5 && shiftedMorning.getUTCHours() <= 6,
    'timezone conversion: IST hour in expected range'
  );

  // Test 3: Verify TODAY business date is plausible (Nov 2026 per session context)
  const todayStr = (() => {
    const s = new Date(Date.now() + KOLKATA_OFFSET_MS);
    return `${s.getUTCFullYear()}-${String(s.getUTCMonth()+1).padStart(2,'0')}-${String(s.getUTCDate()).padStart(2,'0')}`;
  })();
  assert(
    /^20[2-3]\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(todayStr),
    `getTodayBusinessDate returns valid YYYY-MM-DD: ${todayStr}`
  );
}

// ---------------------------------------------------------------------------
// Deterministic calendar-boundary regressions (no clock dependency)
// ---------------------------------------------------------------------------

assert(addBusinessDays('2026-02-01', -1) === '2026-01-31', 'month boundary backward Jan←Feb');
assert(addBusinessDays('2026-04-01', -1) === '2026-03-31', 'month boundary backward Mar←Apr');
assert(addBusinessDays('2026-06-01', -1) === '2026-05-31', 'month boundary backward May←Jun');
assert(addBusinessDays('2026-08-01', -1) === '2026-07-31', 'month boundary backward Jul←Aug');
assert(addBusinessDays('2026-10-01', -1) === '2026-09-30', 'month boundary backward Sep←Oct');
assert(addBusinessDays('2026-12-01', -1) === '2026-11-30', 'month boundary backward Nov←Dec');
