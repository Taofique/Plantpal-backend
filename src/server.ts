import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// Allowed origins: local + production + latest Vercel deployment
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://plantpal-frontend.vercel.app", // main production domain
  "https://plantpal-frontend-he4yc1tuz-taofique-islams-projects.vercel.app", // current Vercel deployment
];

// Global CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow standard HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // allow JSON + JWT headers
  }),
);

// JSON parser middleware
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/activities", activityRoutes);
app.use("/comments", commentRoutes);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("🌱 PlantPal API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await connectDB(); // connect to Supabase/Postgres
    console.log(`🚀 Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
});
