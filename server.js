const mongoose = require("mongoose");
const app = require("./app.js");
require("colors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const dataBaseUrl = process.env.DATABASE_URL;

if (!dataBaseUrl) {
  console.error("No database URL found in environment variables.".red);
  process.exit(1);
}

mongoose
  .connect(dataBaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Opcje MongoDB
  })
  .then(() => {
    console.log("Database connection successful".yellow);
    app.listen(port, () => {
      console.log(`Server running. Use our API on port: ${port}`.cyan);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error: ".red + error.message);
    process.exit(1);
  });
