// src/config/db.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Use DATABASE_URL from Render environment variables
export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // needed for Supabase free tier
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export async function connectDB(retries = 5, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");
      await sequelize.sync({ alter: true });
      console.log("✅ All models synchronized successfully.");
      return;
    } catch (error) {
      console.error(
        `❌ Unable to connect to the database (attempt ${i + 1}/${retries}):`,
        error,
      );
      if (i < retries - 1) {
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error(
          "❌ Could not connect to the database after multiple attempts.",
        );
        // Don't exit process — keep server alive to handle requests gracefully
      }
    }
  }
}
