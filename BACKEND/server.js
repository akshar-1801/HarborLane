const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { app } = require("./app");

dotenv.config();

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database successfully!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    mongoose.connection.close(false, () => {
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
});
