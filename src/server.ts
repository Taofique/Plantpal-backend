import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import plantRoutes from "./routes/plantRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

const allowedOrigins = [
  "https://vercel.com/taofique-islams-projects/plantpal-frontend/H4xChnDuyUFP4w8VVtc9JpEL6VaP",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/plants", plantRoutes);
app.use("/activities", activityRoutes);
app.use("/comments", commentRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("🌱 PlantPal API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server is running on port ${PORT}`);
});
