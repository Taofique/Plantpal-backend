import { Router } from "express";
import {
  createActivity,
  updateActivity,
  getActivitiesById,
  getActivitiesByPlant,
  deleteActivity,
} from "../controllers/activityController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", protect, createActivity);
router.get("/plant", protect, getActivitiesByPlant);
router.get("/:id", protect, getActivitiesById);
router.put("/:id", protect, updateActivity);
router.delete("/:id", deleteActivity);

export default router;
