import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma_client';
import { AuthRequest } from '../types/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get current user profile (protected route)
router.get('/me', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
}));

// Get all users (protected route)
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  res.json({ users });
}));

export default router; 