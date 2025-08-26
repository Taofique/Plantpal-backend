import { User } from "./User.js";
import { Plant } from "./Plant.js";
import { Activity } from "./Activity.js";
import { Comment } from "./Comment.js";

// User & Plant
User.hasMany(Plant, {
  foreignKey: "userId",
  as: "plants",
});
Plant.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

// User & Activity
User.hasMany(Activity, {
  foreignKey: "userId",
  as: "activities",
});
Activity.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Plant & Activity
Plant.hasMany(Activity, {
  foreignKey: "plantId",
  as: "activities",
});
Activity.belongsTo(Plant, {
  foreignKey: "plantId",
  as: "plant",
});

// **Comment associations**
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Plant.hasMany(Comment, { foreignKey: "plantId", as: "comments" });
Comment.belongsTo(Plant, { foreignKey: "plantId", as: "plant" });

export { User, Plant, Activity, Comment };
