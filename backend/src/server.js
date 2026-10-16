const app = require('./app');
const env = require('./config/env');
const { connectDB, mongoose } = require('./config/db');

let server;

async function startServer() {
  try {
    // 1. Establish database connection first
    await connectDB();

    // 2. Start HTTP listener
    server = app.listen(env.port, () => {
      console.log('====================================================');
      console.log(`[Server] Hotel New Moorthi Cafe API running on port ${env.port}`);
      console.log(`[Server] Environment: ${env.nodeEnv}`);
      console.log(`[Server] Business Timezone: ${env.businessTimezone}`);
      console.log(`[Server] Health Endpoint: http://localhost:${env.port}/api/v1/health`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error(`[Startup Failure] Server unable to boot: ${error.message}`);
    process.exit(1);
  }
}

// Graceful shutdown handling
const shutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Commencing graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      mongoose.connection.close(false).then(() => {
        console.log('[Database] MongoDB connection closed.');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception] thrown:', err);
  process.exit(1);
});

startServer();
