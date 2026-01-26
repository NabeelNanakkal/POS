import app from './app.js';
import { config } from './config/constants.js';
import { connectDB } from './config/database.js';
import logger from './utils/logger.js';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

// Connect to database
connectDB();

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 POS System Backend Server                           ║
║                                                           ║
║   Environment: ${config.env.padEnd(43)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   URL: http://localhost:${PORT.toString().padEnd(38)}║
║                                                           ║
║   📚 API Documentation: http://localhost:${PORT}/api/health${' '.padEnd(6)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
