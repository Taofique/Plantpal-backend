// src/routes/commentRoutes.ts
import { Router } from "express";
import {
  createComment,
  getCommentsByPlant,
  updateComment,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/:plantId", getCommentsByPlant);

router.post("/", protect, createComment);

router.put("/:id", protect, updateComment);

router.delete("/:id", protect, deleteComment);

router.post("/:id/like", protect, likeComment);

export default router;
