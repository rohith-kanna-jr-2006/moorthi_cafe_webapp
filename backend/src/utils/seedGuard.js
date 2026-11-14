// Pure staging seed guard validation - no database dependencies
// CommonJS version for backend
// Used by seedMenu.js and tests

/**
 * Extracts database name from MongoDB URI
 */
function extractDbName(uri) {
  const match = uri.match(/\/([^/?#]+)(\?|$)/);
  return match ? match[1] : null;
}

/**
 * Validates staging seed conditions.
 * Returns { authorized: boolean, errors: string[] }
 */
function validateStagingSeed(nodeEnv, mongodbUri, allowStagingSeed, allowProductionMigration) {
  const dbName = extractDbName(mongodbUri);
  const errors = [];

  // A. NODE_ENV must equal "staging" for staging seeding
  if (nodeEnv === 'staging') {
    // C. ALLOW_STAGING_SEED must be exactly "true"
    if (allowStagingSeed !== 'true') {
      errors.push('ALLOW_STAGING_SEED must be exactly "true"');
    }

    // B. Database must be exactly moorthi_cafe_staging
    if (dbName !== 'moorthi_cafe_staging') {
      errors.push(`Database must be moorthi_cafe_staging, got: ${dbName}`);
    }

    // Never allow production database in staging
    if (dbName === 'moorthi_cafe') {
      errors.push('Production database cannot be seeded in staging mode');
    }
  }

  // E. If target database is moorthi_cafe_staging but NODE_ENV is not staging, reject
  if (dbName === 'moorthi_cafe_staging' && nodeEnv !== 'staging') {
    errors.push('Database moorthi_cafe_staging requires NODE_ENV=staging');
  }

  // G. Production guard - ALLOW_PRODUCTION_MIGRATION must be exactly "true"
  if (nodeEnv === 'production' && allowProductionMigration !== 'true') {
    errors.push('Production requires ALLOW_PRODUCTION_MIGRATION=true');
  }

  return { authorized: errors.length === 0, errors };
}

module.exports = {
  extractDbName,
  validateStagingSeed
};