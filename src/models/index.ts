import { User } from "./User.js";
import { Plant } from "./Plant.js";
import { Activity } from "./Activity.js";

User.hasMany(Plant, {
  foreignKey: "userId",
  as: "plants",
});

Plant.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// User and acitivity associations

User.hasMany(Activity, {
  foreignKey: "userId",
  as: "activities",
});

Activity.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Plant and activity associations

Plant.hasMany(Activity, {
  foreignKey: "plantId",
  as: "activities",
});

Activity.belongsTo(Plant, {
  foreignKey: "plantId",
  as: "plant",
});

export { User, Plant, Activity };
