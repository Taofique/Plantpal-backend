import { Router } from "express";
import {
  getAllPlants,
  createPlant,
  getPlantById,
  updatePlant,
  deletePlant,
  getAllPlantsPublic,
  getAllPlantsByUserId,
  searchPlant,
  getPlantByIdPublic,
} from "../controllers/plantController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/public", getAllPlantsPublic);
router.get("/search", searchPlant);
router.get("/public/:id", getPlantByIdPublic);

router.post("/create", protect, createPlant);
router.get("/all", protect, getAllPlants);
router.get("/all/user", protect, getAllPlantsByUserId);
router.get("/:id", protect, getPlantById);
router.put("/:id", protect, updatePlant);
router.delete("/:id", protect, deletePlant);

export default router;
