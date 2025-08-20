// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import cors from "cors"; // Import cors
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";

const app = express();

// Enable CORS middleware - add this right after app creation
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite frontend URL
    credentials: true, // Enable if using cookies/sessions
  })
);

app.use(express.json());

// Your routes
app.use("/users", userRoutes);
app.use("/plants", plantRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("🌱 PlantPal API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB(); // connect DB before serving requests
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
