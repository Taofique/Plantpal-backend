import type { Request, Response } from "express";
import { Plant, User } from "../models/index.js";
import type { TPlant, TPlantCreateInput } from "../types/plant.js";

//........create Plant......POST /plants/create

export const createPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the logged-in user's ID from the authentication middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { name, description, category, waterFrequency, imageUrl } =
      req.body as TPlantCreateInput;

    // Check if the user already has a plant with this name
    const existingPlant = await Plant.findOne({ where: { name, userId } });
    if (existingPlant) {
      res
        .status(400)
        .json({ message: "You already have a plant with this name" });
      return;
    }

    const plant = await Plant.create({
      name,
      description,
      category,
      waterFrequency,
      imageUrl,
      userId, // Add the userId to link the plant to the user
    });

    const plantData = plant.get({ plain: true });
    res.status(201).json(plantData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//.............. Get all Plants..... GET /plants/all

export const getAllPlants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the logged-in user's ID from the authentication middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Only get plants that belong to the authenticated user
    const allPlants = await Plant.findAll({ where: { userId } });
    res.status(200).json(allPlants.map((p) => p.get({ plain: true })));
  } catch (error) {
    console.error("Error fetching plants", error);
    res.status(500).json({ messsage: "Server error" });
  }
};

//...................Get Plant by ID.......GET /plants/:id

export const getPlantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the logged-in user's ID from the authentication middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;

    // Only find the plant if it belongs to the authenticated user
    const plant = await Plant.findOne({ where: { id, userId } });

    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    res.status(200).json(plant.get({ plain: true }));
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//...............Update Plant by ID............. PUT /plants/:id

export const updatePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  // debugging log

  console.log("req.user.id:", req.user?.id, "req.params.id:", req.params.id);

  try {
    // Get the logged-in user's ID from the authentication middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const { name, description, category, waterFrequency, imageUrl } =
      req.body as Partial<TPlantCreateInput>;

    // Only find the plant if it belongs to the authenticated user
    const existingPlant = await Plant.findOne({ where: { id, userId } });
    if (!existingPlant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    const updatePlantData: Partial<TPlantCreateInput> = {};

    if (name !== undefined) updatePlantData.name = name;
    if (description !== undefined) updatePlantData.description = description;
    if (category !== undefined) updatePlantData.category = category;
    if (waterFrequency !== undefined)
      updatePlantData.waterFrequency = waterFrequency;
    if (imageUrl !== undefined) updatePlantData.imageUrl = imageUrl;

    if (Object.keys(updatePlantData).length === 0) {
      res.status(400).json({ message: "No valid fields provided to update" });
      return;
    }

    await existingPlant.update(updatePlantData);
    res.status(200).json(existingPlant.get({ plain: true }));
  } catch (error) {
    console.error("Error updateing plant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//...............Delete plant by ID......... DELETE /plants/:id

export const deletePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get the logged-in user's ID from the authentication middleware
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { id } = req.params;

    // Only find the plant if it belongs to the authenticated user
    const plant = await Plant.findOne({ where: { id, userId } });

    if (!plant) {
      res.status(404).json({ message: "Plant not found" });
      return;
    }

    await plant.destroy();
    res.status(200).json({ message: "Plant Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ message: "Server error" });
  }
};
