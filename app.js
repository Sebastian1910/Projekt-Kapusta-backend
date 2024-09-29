const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const authRoutes = require("./routes/api/authRoutes.js");
const transactionRoutes = require("./routes/api/transactionRoutes.js");
const raportsRoute = require("./routes/api/raportsRoutes.js");
const jwtStrategy = require("./config/jwt.js");

const app = express();

dotenv.config();

const loggerFormats = app.get("env") === "development" ? "dev" : "short";

const corsOptions = {
  origin: "https://projekt-kapusta-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions)); // Używamy CORS z określonymi opcjami

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(cookieParser());

app.use(logger(loggerFormats));

jwtStrategy();

app.use("/api", authRoutes);
app.use("/api", transactionRoutes);
app.use("/api", raportsRoute);

app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, _req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

module.exports = app;
// DDD
