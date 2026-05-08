// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import { connectDB } from "./config/database.js";
// import { errorHandler, notFound } from "./middleware/error.js";
// import { apiLimiter } from "./middleware/rateLimiter.js";
// import authRoutes from "./routes/authRoutes.js";
// import companyRoutes from "./routes/companyRoutes.js";

// // Load environment variables
// dotenv.config();

// // Initialize app
// const app = express();
// app.use(express.json());
// // Set port
// const PORT = process.env.PORT || 8795;

// // Get __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Connect to database
// connectDB();

// // Middleware
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
// const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
//   .split(",")
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   }),
// );

// // Static files for uploads
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // Rate limiting
// app.use("/api/", apiLimiter);

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/companies", companyRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ success: true, message: "Server is running" });
// });

// // Error handling
// app.use(notFound);
// app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/database.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
connectDB();

// --- CORS CONFIGURATION ---
// This handles your production URL, preview URLs, and localhost
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, "")); // Auto-removes trailing slashes

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);

      // Check if the origin is in our list or is a Vercel preview URL
      const isAllowed = allowedOrigins.includes(origin);
      const isVercelPreview = origin.endsWith(".vercel.app");

      if (isAllowed || isVercelPreview) {
        callback(null, true);
      } else {
        console.error(`CORS Error: Origin ${origin} not allowed`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// --------------------------

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Rate limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8795;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});