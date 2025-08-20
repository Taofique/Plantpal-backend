import { User } from "./User.js";
import { Plant } from "./Plant.js";

User.hasMany(Plant, {
  foreignKey: "userId", // ✅ matches model field
  as: "plants",
});

Plant.belongsTo(User, {
  foreignKey: "userId", // ✅ matches model field
  as: "user",
});

export { User, Plant };
