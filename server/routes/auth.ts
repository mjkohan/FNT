import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma_client';
import { loginSchema, registerSchema } from '../utils/validation';
import { hashPassword, comparePassword, generateToken, excludePassword } from '../utils/auth';
import { User } from '../types/auth';

const router = Router();
const prisma = new PrismaClient();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = registerSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const userWithoutPassword = excludePassword(user);
  const token = generateToken(userWithoutPassword);

  res.status(201).json({
    user: userWithoutPassword,
    token,
  });
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const userWithoutPassword = excludePassword(user);
  const token = generateToken(userWithoutPassword);

  res.json({
    user: userWithoutPassword,
    token,
  });
}));

export default router; 