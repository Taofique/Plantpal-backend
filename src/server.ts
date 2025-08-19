// src/server.ts
import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("🌱 PlantPal API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB(); // connect DB before serving requests
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
