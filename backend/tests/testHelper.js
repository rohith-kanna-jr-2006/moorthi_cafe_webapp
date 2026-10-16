const app = require('../src/app');
const { connectDB, mongoose } = require('../src/config/db');
const User = require('../src/models/User');
const { generateToken } = require('../src/controllers/authController');

let serverInstance;
let baseUrl;

async function setupTestServer() {
  await connectDB();
  return new Promise((resolve) => {
    serverInstance = app.listen(0, () => {
      const port = serverInstance.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve({ server: serverInstance, baseUrl });
    });
  });
}

async function teardownTestServer() {
  if (serverInstance) {
    await new Promise((resolve) => serverInstance.close(resolve));
  }
  await mongoose.connection.close(false);
}

function getBaseUrl() {
  return baseUrl;
}

async function apiRequest(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json();
  return { status: response.status, body: json };
}

module.exports = {
  setupTestServer,
  teardownTestServer,
  getBaseUrl,
  apiRequest,
};
