// app.js
require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const sequelize = require("./config/database");
const { swaggerUi, specs } = require("./config/swagger");
const socketHandlers = require("./socket/socketHandlers");

const rateLimiter = require("./middleware/rateLimiter");

// Route imports
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const entrepreneurRoutes = require("./routes/entrepreneur");
const investorRoutes = require("./routes/investor");
const messageRoutes = require("./routes/messages");
const emailRoutes = require("./routes/email");
const userRoutes = require("./routes/users");
const profileRoutes = require("./routes/profiles");
const projectRoutes = require("./routes/projects");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(rateLimiter);

// Swagger API Docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/entrepreneur", entrepreneurRoutes);
app.use("/api/investor", investorRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/projects", projectRoutes);

// Health Check
app.get("/api/health", (req, res) => res.send("WomenConnectHub API is running."));

// Export the app
module.exports = app;

// Export a function to initialize socket.io (optional, to be called by server.js)
module.exports.initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  socketHandlers(io);
  return io;
};
