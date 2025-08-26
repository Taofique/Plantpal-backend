import { Router } from "express";
import {
  createActivity,
  updateActivity,
  getActivitiesById,
  getActivitiesByPlant,
  deleteActivity,
  getAllActivities,
} from "../controllers/activityController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", protect, createActivity);

router.get("/plant/:plantId", protect, getActivitiesByPlant);
router.get("/all", protect, getAllActivities); // put BEFORE /:id

router.get("/:id", protect, getActivitiesById);

router.put("/:id", protect, updateActivity);
router.delete("/:id", protect, deleteActivity);

export default router;
