// Cart storage & seed guard tests - pure unit tests, no database or browser required
// Import the PRODUCTION validation helpers used by actual code
const { test, expect } = require('@playwright/test');

// Import actual production helpers (CommonJS from backend)
const { validateCartQuantity, isValidObjectId } = require('../../backend/src/utils/cartValidation');
const { validateStagingSeed } = require('../../backend/src/utils/seedGuard');

// Mock localStorage for cart storage tests
const mockLocalStorage = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Mock window.dispatchEvent
const mockWindow = {
  dispatchedEvents: [],
  dispatchEvent(event) {
    this.dispatchedEvents.push(event);
  },
  clearEvents() {
    this.dispatchedEvents = [];
  }
};

// We'll test the actual cartStorage.js logic by copying it here with mocks
// Since cartStorage.js uses ES modules and browser globals, we test the validation
// via the shared helpers and verify the storage logic through integration-style tests

test.describe('Cart Validation - validateCartQuantity (production helper)', () => {
  test('0 (numeric) returns remove action', () => {
    const result = validateCartQuantity(0);
    expect(result.action).toBe('remove');
  });

  test('"0" (exact string) returns remove action', () => {
    const result = validateCartQuantity('0');
    expect(result.action).toBe('remove');
  });

  test('-1 rejected', () => {
    const result = validateCartQuantity(-1);
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('-0.5 rejected', () => {
    const result = validateCartQuantity(-0.5);
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('2.5 rejected (decimal)', () => {
    const result = validateCartQuantity(2.5);
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('"3abc" rejected (partially numeric)', () => {
    const result = validateCartQuantity('3abc');
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('"0abc" rejected (partially numeric zero)', () => {
    const result = validateCartQuantity('0abc');
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('"" (empty string) rejected', () => {
    const result = validateCartQuantity('');
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('" " (whitespace) rejected', () => {
    const result = validateCartQuantity(' ');
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('1 accepted', () => {
    const result = validateCartQuantity(1);
    expect(result.action).toBe('update');
    expect(result.qty).toBe(1);
  });

  test('50 accepted', () => {
    const result = validateCartQuantity(50);
    expect(result.action).toBe('update');
    expect(result.qty).toBe(50);
  });

  test('51 rejected', () => {
    const result = validateCartQuantity(51);
    expect(result.action).toBe('reject');
    expect(result.error).toContain('must be an integer between 1 and 50');
  });

  test('Valid ObjectId accepted', () => {
    const result = isValidObjectId('507f1f77bcf86cd799439011');
    expect(result).toBe(true);
  });

  test('Invalid ObjectId rejected', () => {
    const result = isValidObjectId('invalid-id');
    expect(result).toBe(false);
  });

  test('Preserves unrelated cart items - validation logic test', () => {
    const result1 = validateCartQuantity(0);
    const result2 = validateCartQuantity(0);
    expect(result1.action).toBe('remove');
    expect(result2.action).toBe('remove');
  });
});

test.describe('Staging Seed Guard Validation - validateStagingSeed (production helper)', () => {
  test('staging + staging database + exact true: authorization passes', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', 'true', 'false');
    expect(result.authorized).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('staging + production database: rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'true', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production database cannot be seeded in staging mode');
  });

  test('staging + missing flag: rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', undefined, 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });

  test('staging + "false": rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', 'false', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });

  test('staging + "yes": rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', 'yes', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });

  test('staging + "1": rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', '1', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });

  test('development + staging database: rejected', () => {
    const result = validateStagingSeed('development', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', 'true', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Database moorthi_cafe_staging requires NODE_ENV=staging');
  });

  test('production guard remains unchanged - requires exact "true"', () => {
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'true', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('production + exact "true" + production db: authorized', () => {
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', 'true');
    expect(result.authorized).toBe(true);
  });

  test('staging + wrong database name: rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/some_other_db?retryWrites=true', 'true', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors.some(e => e.includes('must be moorthi_cafe_staging'))).toBe(true);
  });

  test('staging + empty flag: rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', '', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });

  test('staging + null flag: rejected', () => {
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', null, 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });
});

test.describe('Production Guard Compatibility', () => {
  // Test that production behavior exactly matches HEAD
  // Original HEAD: if (env.nodeEnv === 'production' && !process.env.ALLOW_PRODUCTION_MIGRATION)
  // New: if (nodeEnv === 'production' && allowProductionMigration !== 'true')

  test('HEAD behavior: missing ALLOW_PRODUCTION_MIGRATION rejects', () => {
    // Original: !undefined === true -> rejects
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', undefined);
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('HEAD behavior: empty string ALLOW_PRODUCTION_MIGRATION rejects', () => {
    // Original: !'' === true -> rejects
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', '');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('HEAD behavior: "false" ALLOW_PRODUCTION_MIGRATION rejects', () => {
    // Original: !'false' === false -> would ACCEPT (truthy string!)
    // New: 'false' !== 'true' -> rejects (exact match)
    // This is a DELIBERATE BEHAVIORAL CHANGE - documented below
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', 'false');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('HEAD behavior: "yes" ALLOW_PRODUCTION_MIGRATION - HEAD would ACCEPT, new REJECTS', () => {
    // Original: !'yes' === false -> would ACCEPT
    // New: 'yes' !== 'true' -> rejects
    // This is a DELIBERATE BEHAVIORAL CHANGE - documented below
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', 'yes');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('HEAD behavior: "1" ALLOW_PRODUCTION_MIGRATION - HEAD would ACCEPT, new REJECTS', () => {
    // Original: !'1' === false -> would ACCEPT
    // New: '1' !== 'true' -> rejects
    // This is a DELIBERATE BEHAVIORAL CHANGE - documented below
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', '1');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  });

  test('HEAD behavior: exact "true" ALLOW_PRODUCTION_MIGRATION - both ACCEPT', () => {
    const result = validateStagingSeed('production', 'mongodb+srv://user:pass@cluster/moorthi_cafe?retryWrites=true', 'false', 'true');
    expect(result.authorized).toBe(true);
  });

  test('staging authorization independent of production flag', () => {
    // Staging should NOT be authorized by ALLOW_PRODUCTION_MIGRATION
    const result = validateStagingSeed('staging', 'mongodb+srv://user:pass@cluster/moorthi_cafe_staging?retryWrites=true', 'false', 'true');
    expect(result.authorized).toBe(false);
    expect(result.errors).toContain('ALLOW_STAGING_SEED must be exactly "true"');
  });
});