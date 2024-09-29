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

const allowedOrigins = [
  "http://localhost:5173",
  "https://projekt-kapusta-frontend.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/api/login", cors(corsOptions));

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
