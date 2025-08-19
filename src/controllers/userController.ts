import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { User } from "../models/User.js";
import dotenv from "dotenv";
import type { TUserCreateInput, TUser } from "../types/user.js";

dotenv.config();

// Ensure we have the JWT secret typed correctly
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

//......................... Register ........................................//
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body as TUserCreateInput;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Exclude password before sending response
    const { password: _, ...userData } = user.get({ plain: true });
    res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//......................... Login ........................................//

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not configured");
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const hashedPassword = user.get("password") as string;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const payload = {
      id: user.get("id"),
      username: user.get("username"),
      email: user.get("email"),
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    } as SignOptions);

    const { password: _, ...userData } = user.get({ plain: true }) as TUser;

    res.status(200).json({ user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
