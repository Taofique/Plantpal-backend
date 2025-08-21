import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
import type { TActivity, TActivityCreateInput } from "../types/activity.js";

export const Activity = sequelize.define<
  Model<TActivity, TActivityCreateInput>
>(
  "Activity",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    plantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "plant_id",
      references: {
        model: "plants",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(
        "water",
        "fertilize",
        "insecticide",
        "weed",
        "custom"
      ),
      allowNull: false,
      defaultValue: "custom",
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false, // UTC Time so its a must
      field: "due_at",
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "completed_at",
    },
  },
  {
    tableName: "activities",
    timestamps: true,
    underscored: true,
  }
);
