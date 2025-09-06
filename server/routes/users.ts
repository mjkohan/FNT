import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma_client';
import { AuthRequest } from '../types/auth';
import { authenticateToken } from '../middleware/auth';
import { 
  updateEmailSchema, 
  changePasswordSchema,
  UpdateEmailInput,
  ChangePasswordInput 
} from '../utils/validation';

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

// Update user email
router.put('/email', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = updateEmailSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: validation.error.errors 
    });
    return;
  }

  const { email }: UpdateEmailInput = validation.data;

  // Check if email is already taken by another user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser && existingUser.id !== req.user!.id) {
    res.status(409).json({ error: 'Email is already taken' });
    return;
  }

  // Update the email
  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: { email },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  res.json({ user: updatedUser });
}));

// Change user password
router.put('/password', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = changePasswordSchema.safeParse(req.body);
  
  if (!validation.success) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: validation.error.errors 
    });
    return;
  }

  const { currentPassword, newPassword }: ChangePasswordInput = validation.data;

  // Get user with password to verify current password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!isCurrentPasswordValid) {
    res.status(400).json({ error: 'Current password is incorrect' });
    return;
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { password: hashedNewPassword },
  });

  res.json({ message: 'Password updated successfully' });
}));

// Get user profile with bookmarks
router.get('/profile', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      createdAt: true,
      bookmarks: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user });
}));

export default router; 