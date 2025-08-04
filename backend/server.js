// server.js
require("dotenv").config();
const http = require("http");
const app = require("./app");
const sequelize = require("./config/database");

const server = http.createServer(app);
const { initSocket } = require("./app");

// Initialize socket.io on the server
initSocket(server);

const startServer = async (port) => {
  return new Promise((resolve, reject) => {
    const srv = server.listen(port)
      .on("listening", () => {
        console.log(`Server listening on port ${port}`);
        resolve(port);
      })
      .on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.warn(`❌ Port ${port} in use, trying port ${port + 1}...`);
          srv.close(() => {
            startServer(port + 1).then(resolve).catch(reject);
          });
        } else {
          reject(err);
        }
      });
  });
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();

    const basePort = process.env.PORT ? parseInt(process.env.PORT) : 9002;
    await startServer(basePort);
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
})();
