export type TPlant = {
  id: number;
  name: string;
  description: string;
  category: string;
  waterFrequency: number;
  imageUrl: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TPlantCreateInput = Omit<TPlant, "id" | "createdAt" | "updatedAt">;
