import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./auth.model";
import { registerSchema, loginSchema } from "./auth.schema";
import { env } from "../../config/env";
import { generateAvatarUrl } from "../../lib/dicebear";

export const register = async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { name, email, password } = parsed.data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ success: false, message: "Email already in use" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const avatarUrl = generateAvatarUrl(email); // Use email as stable seed
  const user = await User.create({ name, email, passwordHash, avatarUrl });

  const token = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as any,
  );

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as any,
  );

  res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    },
  });
};

// get current user
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById((req as any).user.id);
  if (!user) {
    res.status(404).json({ success: false, message: "User not found" });
    return;
  }
  res.status(200).json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
  });
};
