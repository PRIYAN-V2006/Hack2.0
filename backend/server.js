import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import { testDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();

/* ==============================
   CORS
============================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ==============================
   JSON Middleware
============================== */

app.use(express.json());

/* ==============================
   Test Route
============================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VTOP Backend API is running."
  });
});

/* ==============================
   Authentication Routes
============================== */

app.use("/api/auth", authRoutes);

/* ==============================
   Server
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log("");
  console.log("=================================");
  console.log("🚀 VTOP Backend Server");
  console.log("=================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Login API: http://localhost:${PORT}/api/auth/login`);
  console.log("=================================");
  console.log("");

  await testDatabaseConnection();
});