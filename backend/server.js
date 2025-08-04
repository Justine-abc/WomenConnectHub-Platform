// server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const sequelize = require("./config/database");
const { initSocket } = require("./app");

// Create the HTTP server
const server = http.createServer(app);

// Attach socket.io to the server
initSocket(server);

// Start server on specified port, fallback to next available if in use
const startServer = async (port) => {
  return new Promise((resolve, reject) => {
    const srv = server.listen(port)
      .on("listening", () => {
        console.log(`✅ Server listening on port ${port}`);
        resolve(port);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.warn(`❌ Port ${port} is in use. Trying port ${port + 1}...`);
          srv.close(() => {
            startServer(port + 1).then(resolve).catch(reject);
          });
        } else {
          console.error(`❌ Server error on port ${port}:`, err);
          reject(err);
        }
      });
  });
};

// Initialize database and launch the server
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("🔄 Database synchronized");

    const basePort = process.env.PORT ? parseInt(process.env.PORT) : 9007;
    await startServer(basePort);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
