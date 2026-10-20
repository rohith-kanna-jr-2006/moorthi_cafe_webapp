// Strictly isolate tests from development and production databases
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/moorthi_cafe_test';
