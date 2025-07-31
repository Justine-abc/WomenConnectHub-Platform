// app.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
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
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

socketHandlers(io);

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

// Server and DB Init
const PORT = process.env.PORT || 5000;
(async () => {
 try {
  await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync();
    server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();
