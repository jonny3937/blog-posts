import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "Email already exists" });

  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsername)
    return res.status(400).json({ message: "Username already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: { username, email, password: hashedPassword, firstName, lastName },
  });

  const user = {
    id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
  };

  const token = generateToken(user.id);
  res.status(201).json({ user, token });
};

export const login = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  let foundUser;
  if (email) {
    foundUser = await prisma.user.findUnique({ where: { email } });
  } else if (username) {
    foundUser = await prisma.user.findUnique({ where: { username } });
  } else {
    res.status(400).json({ message: "Email or username is required" });
    return;
  }

  if (!foundUser) return res.status(404).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, foundUser.password);
  if (!isValid) return res.status(401).json({ message: "Invalid password" });

  const user = {
    id: foundUser.id,
    username: foundUser.username,
    email: foundUser.email,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
  };

  const token = generateToken(user.id);
  res.json({ user, token });
};
