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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://projekt-kapusta-frontend.vercel.app",
  "https://projekt-kapusta-backend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS", // Dodaj 'OPTIONS' do metod
    allowedHeaders: ["Content-Type", "Authorization"], // Upewnij się, że nagłówki są dozwolone
    credentials: true,
  })
);

app.options("*", cors());

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
