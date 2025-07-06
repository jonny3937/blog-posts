import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};
