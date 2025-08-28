import type { Request, Response } from "express";
import { Plant, User } from "../models/index.js";
import type { TPlant, TPlantCreateInput } from "../types/plant.js";
import { Op } from "sequelize";

// -------- Create Plant (POST /plants/create) --------
export const createPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { name, description, category, waterFrequency, imageUrl } =
      req.body as TPlantCreateInput;

    // Check for existing plant
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
      userId,
    });

    res.status(201).json(plant.get({ plain: true }));
  } catch (error) {
    console.error("Error creating plant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------- Get All Public Plants (GET /public) --------
export const getAllPlantsPublic = async (req: Request, res: Response) => {
  try {
    const plants = await Plant.findAll({
      attributes: ["id", "name", "imageUrl"],
    });
    res.json(plants);
  } catch (error) {
    console.error("Error fetching public plants:", error);
    res.status(500).json({ message: "Failed to fetch plants" });
  }
};

// -------- Get All User Plants Protected route (GET /plants/all) --------

export const getAllPlants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allPlants = await Plant.findAll({
      include: [
        {
          model: User,
          as: "owner", // must match Plant.belongsTo alias
          attributes: ["username"],
        },
      ],
    });

    const plantsWithUsername = allPlants.map((p) => {
      const plain = p.get({ plain: true }) as any;
      return {
        ...plain,
        username: plain.owner?.username || "Unknown",
      };
    });

    res.status(200).json(plantsWithUsername);
  } catch (error) {
    console.error("Error fetching plants", error);
    res.status(500).json({ message: "Server error" });
  }
};

//................Get all plants by User Id..........................

// -------- Get All User Plants (GET /plants/all) --------
export const getAllPlantsByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const userPlants = await Plant.findAll({
      where: { userId }, // ✅ fetch only this user's plants
      include: [
        {
          model: User,
          as: "owner", // must match Plant.belongsTo alias
          attributes: ["username"],
        },
      ],
    });

    const plantsWithUsername = userPlants.map((p) => {
      const plain = p.get({ plain: true }) as any;
      return {
        ...plain,
        username: plain.owner?.username || "Unknown",
      };
    });

    res.status(200).json(plantsWithUsername);
  } catch (error) {
    console.error("Error fetching plants", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------- Get Plant by ID (GET /plants/:id) --------
export const getPlantById = async (
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

// -------- Update Plant by ID (PUT /plants/:id) --------
export const updatePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { name, description, category, waterFrequency, imageUrl } =
      req.body as Partial<TPlantCreateInput>;

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
    console.error("Error updating plant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------- Delete Plant by ID (DELETE /plants/:id) --------
export const deletePlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

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

//......................Search Function(Public)................//

export const searchPlant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const qRaw = req.query.q as string;
    const limit = Math.min(Number(req.query.limit) || 5, 20);

    if (!qRaw || !qRaw.trim()) {
      res.json([]);
      return;
    }

    const plants = await Plant.findAll({
      where: {
        name: { [Op.iLike]: `%${qRaw.trim()}%` },
      },
      attributes: ["id", "name", "imageUrl"], // ✅ only public-safe fields
      limit,
      order: [["updatedAt", "DESC"]],
    });

    res.json(plants.map((p) => p.get({ plain: true })));
  } catch (error) {
    console.error("Error searching plants", error);
    res.status(500).json({ message: "Server error" });
  }
};
