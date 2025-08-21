import type { Request, Response } from "express";
import type { TActivity, TActivityCreateInput } from "../types/activity.js";
import { Activity, Plant } from "../models/index.js";

// Create activity POST /activities/create

export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { plantId, title, type, notes, dueAt } =
      req.body as TActivityCreateInput;

    const plant = await Plant.findOne({ where: { id: plantId, userId } });

    if (!plant) {
      res.status(404).json({ message: "Plant not found or not yours" });
      return;
    }

    const activity = await Activity.create({
      userId,
      plantId,
      title,
      type,
      notes: notes ?? null,
      dueAt,
      completedAt: null,
    });

    res.status(201).json(activity.get({ plain: true }));
  } catch (error) {
    console.error("Error creating activity", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET activities/plant/:id

export const getActivitiesByPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { plantId } = req.params;

    const plant = await Plant.findOne({ where: { id: plantId, userId } });
    if (!plant) {
      res.status(404).json({ message: "Plant not found or not yours" });
    }

    const activities = await Activity.findAll({ where: { plantId, userId } });

    res.status(200).json(activities.map((a) => a.get({ plain: true })));
  } catch (error) {
    console.error("Error fetching activities", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get single acitvity by ID: GET activities/:id

export const getActivitiesById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const activity = await Activity.findOne({ where: { id, userId } });

    if (!activity) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// update => PUT /activities/:id

export const updateActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const { title, type, notes, dueAt, completedAt } =
      req.body as Partial<TActivityCreateInput>;

    const existingActivity = await Activity.findOne({
      where: { id: id, userId },
    });
    if (!existingActivity) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    const updateActivityData: Partial<TActivityCreateInput> = {};

    if (title !== undefined) updateActivityData.title = title;
    if (type !== undefined) updateActivityData.type = type;
    if (notes !== undefined) updateActivityData.notes = notes;
    if (dueAt !== undefined) updateActivityData.dueAt = dueAt;
    if (completedAt !== undefined) updateActivityData.completedAt = completedAt;

    if (Object.keys(updateActivityData).length === 0) {
      res.status(400).json({ message: "No valid fields provided to update" });
      return;
    }

    await existingActivity.update(updateActivityData);
    res.status(200).json(existingActivity.get({ plain: true }));
  } catch (error) {
    console.error("Error updating activity", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /activities/:id

export const deleteActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;

    const activity = await Activity.findOne({ where: { id, userId } });

    if (!activity) {
      res.status(404).json({ message: "Activity not found" });
      return;
    }

    await activity.destroy();
    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity", error);
    res.status(500).json({ message: "Server error" });
  }
};
