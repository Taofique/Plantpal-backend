// src/server.ts
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://plantpal-frontend.vercel.app",
  "https://plantpal-frontend-he4yc1tuz-taofique-islams-projects.vercel.app",
  "https://plantpal-frontend-92n9gzuwc-taofique-islams-projects.vercel.app", // new deployment
];

// Global CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman or server-to-server
      if (allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// JSON parser
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/activities", activityRoutes);
app.use("/comments", commentRoutes);

// Root route
app.get("/", (_req, res) => res.send("🌱 PlantPal API is running!"));

// Start server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(); // try connecting to DB
  } catch (err) {
    console.error("❌ Database connection failed. Server still running:", err);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();
