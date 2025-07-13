import { PrismaClient } from "./generated/prisma";
import dotenv from "dotenv";

dotenv.config();

export const prisma = new PrismaClient();
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
