import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import type { TPlant, TPlantCreateInput } from "../types/plant.js";

export const Plant = sequelize.define<Model<TPlant, TPlantCreateInput>>(
  "Plant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    waterFrequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "plants",
    timestamps: true,
  }
);
