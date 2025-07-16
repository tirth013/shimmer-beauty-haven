// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDb = require("./config/dbConnection");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/categoryRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (for JSON parsing)
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // Updated to match Vite dev server port
  })
);
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Example route
app.get("/", (req, res) => {
  res.send("API is running!");
});
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);

// Connect to DB and start server
const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

startServer();
