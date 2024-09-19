const mongoose = require("mongoose");
const app = require("./app.js");
require("colors");

const port = process.env.PORT || 3000;
const dataBaseUrl = process.env.DATABASE_URL;

mongoose
  .connect(dataBaseUrl)
  .then(() => {
    console.log("Database connection successful".yellow);
    app.listen(port, () => {
      console.log(`Server running. Use our API on port: ${port}`.cyan);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error. " + error);
    process.exit(1);
  });
