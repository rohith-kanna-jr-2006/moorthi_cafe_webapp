const PRODUCTION_FRONTEND = 'https://moorthicafe.netlify.app';
const PRODUCTION_API = 'https://moorthi-cafe-api.onrender.com/api/v1';
const STAGING_FRONTEND = 'https://moorthi-cafe-staging.netlify.app';
const STAGING_API = 'https://moorthi-cafe-webapp.onrender.com/api/v1';

function getBaseURL() {
  return process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:9004';
}

function getAPIBaseURL() {
  return process.env.API_BASE_URL || 'http://127.0.0.1:5000/api/v1';
}

function validateURLs(env = 'local') {
  const baseURL = getBaseURL();
  const apiURL = getAPIBaseURL();

  if (env === 'production') {
    if (!baseURL.includes('moorthicafe.netlify.app')) {
      throw new Error(`[Production Guard] Expected production frontend, got: ${baseURL}`);
    }
    if (!apiURL.includes('moorthi-cafe-api.onrender.com')) {
      throw new Error(`[Production Guard] Expected production API, got: ${apiURL}`);
    }
  } else if (env === 'staging') {
    if (baseURL.includes('moorthicafe.netlify.app') || baseURL === PRODUCTION_FRONTEND) {
      throw new Error(`[Staging Guard] Refusing to run against production frontend: ${baseURL}`);
    }
    if (apiURL.includes('moorthi-cafe-api.onrender.com') || apiURL === PRODUCTION_API) {
      throw new Error(`[Staging Guard] Refusing to run against production API: ${apiURL}`);
    }
  }

  console.log(`[${env.toUpperCase()} Test Guard] ✅ URLs validated`);
  console.log(`  Frontend: ${baseURL}`);
  console.log(`  API: ${apiURL}`);
}

module.exports = async () => {
  const env = process.env.TEST_ENV || 'local';
  validateURLs(env);
};