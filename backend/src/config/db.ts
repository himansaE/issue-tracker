import mongoose from "mongoose";
import { env } from "./env";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};
