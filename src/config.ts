import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

export const prisma = new PrismaClient();
export const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
