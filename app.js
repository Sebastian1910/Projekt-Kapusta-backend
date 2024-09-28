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

// Załaduj zmienne środowiskowe
dotenv.config();

// Ustaw format loggera w zależności od środowiska
const loggerFormats = app.get("env") === "development" ? "dev" : "short";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfiguracja CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://projekt-kapusta-backend.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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

// Obsługa preflight requests
app.options("*", cors()); // Obsługuj wszystkie preflight requests

// Zabezpieczenia Helmet
app.use(helmet());

// Obsługa ciasteczek
app.use(cookieParser());

// Logger dla aplikacji
app.use(logger(loggerFormats));

// Konfiguracja JWT
jwtStrategy();

// Trasy API
app.use("/api", authRoutes);
app.use("/api", transactionRoutes);
app.use("/api", raportsRoute);

// Obsługa trasy 404
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Middleware do obsługi błędów
app.use((err, _req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

module.exports = app;
