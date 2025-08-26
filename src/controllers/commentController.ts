// src/controllers/commentController.ts
import type { Request, Response } from "express";
import type { TCommentCreateInput } from "../types/comment.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js"; // <-- import User model to fetch username
import type { TUser, TUserCreateInput } from "../types/user.js";

// Create a new comment
// POST /comments
export const createComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { plantId, content } = req.body as TCommentCreateInput;

    if (!content || !plantId) {
      return res
        .status(400)
        .json({ message: "Content and plantId are required" });
    }

    // Fetch the username from DB
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.get({ plain: true }) as TUser;

    const comment = await Comment.create({
      plantId,
      userId,
      username: userData.username,
      content,
    });

    res.status(201).json(comment.get({ plain: true }));
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a plant
export const getCommentsByPlant = async (req: Request, res: Response) => {
  try {
    const { plantId } = req.params;
    const comments = await Comment.findAll({
      where: { plantId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(comments.map((c) => c.get({ plain: true })));
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    const { content } = req.body as Partial<TCommentCreateInput>;

    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (!content)
      return res.status(400).json({ message: "Content is required" });

    await comment.update({ content });
    res.status(200).json(comment.get({ plain: true }));
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id, userId } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a comment
export const likeComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.increment("likes", { by: 1 });
    await comment.reload();

    res.status(200).json(comment.get({ plain: true }));
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
