import { Sequelize } from "sequelize";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5, // keep this small on free tiers
    min: 0,
    acquire: 30000, // how long Sequelize tries to get a connection
    idle: 10000, // how long a connection can be idle before release
  },
});

export async function connectDB(retries = 5, delay = 5000) {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established successfully.");

      await sequelize.sync({ alter: true });
      console.log("✅ All models were synchronized successfully.");
      return; // success, exit retry loop
    } catch (error) {
      console.error(
        `❌ Unable to connect to the database (retries left: ${retries - 1}):`,
        error
      );
      retries -= 1;
      if (!retries) {
        process.exit(1); // final failure, exit
      }
      await new Promise((res) => setTimeout(res, delay)); // wait before retrying
    }
  }
}
