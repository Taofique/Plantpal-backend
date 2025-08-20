import { Router } from "express";
import {
  getAllPlants,
  createPlant,
  getPlantById,
  updatePlant,
  deletePlant,
} from "../controllers/plantController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", protect, createPlant);
router.get("/all", protect, getAllPlants);
router.get("/:id", protect, getPlantById);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

export default router;
