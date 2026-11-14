const { defineConfig, devices } = require('@playwright/test');

const PRODUCTION_FRONTEND = 'https://moorthicafe.netlify.app';
const PRODUCTION_API = 'https://moorthi-cafe-api.onrender.com/api/v1';

function getStagingBaseURL() {
  return process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
}

function getStagingAPIURL() {
  return process.env.API_BASE_URL || PRODUCTION_API;
}

// Safety: refuse to run against production
function validateStagingURLs() {
  const baseURL = getStagingBaseURL();
  const apiURL = getStagingAPIURL();

  if (baseURL.includes('moorthicafe.netlify.app') || baseURL === PRODUCTION_FRONTEND) {
    throw new Error(`[Staging Test Guard] Refusing to run against production frontend: ${baseURL}`);
  }

  if (apiURL.includes('moorthi-cafe-api.onrender.com') || apiURL === PRODUCTION_API) {
    throw new Error(`[Staging Test Guard] Refusing to run against production API: ${apiURL}`);
  }

  console.log('[Staging Test Guard] ✅ URLs validated for staging environment');
  console.log(`  Frontend: ${baseURL}`);
  console.log(`  API: ${apiURL}`);
}

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: getStagingBaseURL(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],

  globalSetup: async () => {
    // Validate staging URLs before tests run
    validateStagingURLs();
  }
});