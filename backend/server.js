require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const http = require('http');
const socketIo = require('socket.io');
const { setupSocketHandlers } = require('./socket/socketHandlers');

const PORT = process.env.PORT || 5000;
const HOST = process.env.DB_HOST || 'localhost';

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Setup socket handlers
setupSocketHandlers(io);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync database models (only in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized');
    }

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 WomenConnect Hub Backend Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🔄 Environment: ${process.env.NODE_ENV}`);
      console.log(`💾 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}`);
    });

  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  await sequelize.close();
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = { server, io };