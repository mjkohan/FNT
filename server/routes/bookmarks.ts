import { Router, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../generated/prisma_client';
import { AuthRequest } from '../types/auth';
import { authenticateToken } from '../middleware/auth';
import { 
  createBookmarkSchema, 
  updateBookmarkSchema,
  CreateBookmarkInput,
  UpdateBookmarkInput 
} from '../utils/validation';

const router = Router();
const prisma = new PrismaClient();

// Get all bookmarks for the current user
router.get('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: req.user!.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({ bookmarks });
}));

// Get bookmarks by category
router.get('/category/:category', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { category } = req.params;
  
  if (!['crypto', 'stocks', 'commodities'].includes(category)) {
    return res.status(400).json({ error: 'Invalid category. Must be one of: crypto, stocks, commodities' });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: req.user!.id,
      category: category as 'crypto' | 'stocks' | 'commodities',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json({ bookmarks });
}));

// Create a new bookmark
router.post('/', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = createBookmarkSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validation.error.errors 
    });
  }

  const { category, symbol }: CreateBookmarkInput = validation.data;

  // Check if bookmark already exists
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_category_symbol: {
        userId: req.user!.id,
        category,
        symbol,
      },
    },
  });

  if (existingBookmark) {
    return res.status(409).json({ error: 'Bookmark already exists' });
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      category,
      symbol,
      userId: req.user!.id,
    },
  });

  res.status(201).json({ bookmark });
}));

// Update a bookmark
router.put('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookmarkId = parseInt(req.params.id);
  
  if (isNaN(bookmarkId)) {
    return res.status(400).json({ error: 'Invalid bookmark ID' });
  }

  const validation = updateBookmarkSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validation.error.errors 
    });
  }

  // Check if bookmark exists and belongs to user
  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId: req.user!.id,
    },
  });

  if (!existingBookmark) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  const updateData: UpdateBookmarkInput = validation.data;

  // If updating category or symbol, check for duplicates
  if (updateData.category || updateData.symbol) {
    const newCategory = updateData.category || existingBookmark.category;
    const newSymbol = updateData.symbol || existingBookmark.symbol;

    const duplicateBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: req.user!.id,
        category: newCategory,
        symbol: newSymbol,
        id: { not: bookmarkId },
      },
    });

    if (duplicateBookmark) {
      return res.status(409).json({ error: 'A bookmark with this category and symbol already exists' });
    }
  }

  const updatedBookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: updateData,
  });

  res.json({ bookmark: updatedBookmark });
}));

// Delete a bookmark
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const bookmarkId = parseInt(req.params.id);
  
  if (isNaN(bookmarkId)) {
    return res.status(400).json({ error: 'Invalid bookmark ID' });
  }

  // Check if bookmark exists and belongs to user
  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId: req.user!.id,
    },
  });

  if (!existingBookmark) {
    return res.status(404).json({ error: 'Bookmark not found' });
  }

  await prisma.bookmark.delete({
    where: { id: bookmarkId },
  });

  res.status(204).send();
}));

// Toggle bookmark (add if doesn't exist, remove if exists)
router.post('/toggle', authenticateToken, asyncHandler(async (req: AuthRequest, res: Response) => {
  const validation = createBookmarkSchema.safeParse(req.body);
  
  if (!validation.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validation.error.errors 
    });
  }

  const { category, symbol }: CreateBookmarkInput = validation.data;

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_category_symbol: {
        userId: req.user!.id,
        category,
        symbol,
      },
    },
  });

  if (existingBookmark) {
    // Remove bookmark
    await prisma.bookmark.delete({
      where: { id: existingBookmark.id },
    });
    res.json({ action: 'removed', bookmark: null });
  } else {
    // Add bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        category,
        symbol,
        userId: req.user!.id,
      },
    });
    res.json({ action: 'added', bookmark });
  }
}));

export default router;
