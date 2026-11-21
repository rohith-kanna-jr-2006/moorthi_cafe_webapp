/**
 * Playwright E2E tests for src/utils/businessDate.js — timezone & calendar math
 * Run with Node directly (no framework dependency). Verifies cross-timezone correctness.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
let passed = 0;
let failures = 0;

function assert(cond, label) {
  if (cond) { passed++; return; }
  failures++;
  console.error(`FAIL: ${label}`);
}

// ---------------------------------------------------------------------------
// Run the existing unit tests under different TZ values
// ---------------------------------------------------------------------------

const baseTz = process.env.TZ;

for (const tz of ['UTC', 'Asia/Kolkata', 'America/New_York', 'Europe/London', 'Pacific/Auckland']) {
  const env = { ...process.env, TZ: tz };
  try {
    execSync(`node "${path.resolve(__dirname, 'businessDate.test.js')}"`, { env, encoding: 'utf8', stdio: 'pipe' });
    assert(true, `[TZ=${tz}] businessDate.unit.tests pass`);
  } catch (e) {
    assert(false, `[TZ=${tz}] businessDate.unit.tests FAILED`);
  }
}

// Restore original TZ
if (baseTz) {
  process.env.TZ = baseTz;
} else {
  delete process.env.TZ;
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\nbusinessDate.timeZone.test.js: ${passed} passed, ${failures} failed\n`);
if (failures > 0) process.exit(1);
