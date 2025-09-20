import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

// Allowed origins: add your deployed frontend URL
const allowedOrigins = [
  "https://plantpal-frontend-51lj90kv8-taofique-islams-projects.vercel.app",
  "https://plantpal-frontend.vercel.app", // optional canonical domain
  undefined, // allow requests with no origin (like Postman or some server-to-server calls)
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS request from origin:", origin); // debug
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/activities", activityRoutes);
app.use("/comments", commentRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("🌱 PlantPal API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
