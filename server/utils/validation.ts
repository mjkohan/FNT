import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Bookmark validation schemas
export const createBookmarkSchema = z.object({
  category: z.enum(['crypto', 'stocks', 'commodities'], {
    errorMap: () => ({ message: 'Category must be one of: crypto, stocks, commodities' })
  }),
  symbol: z.string().min(1, 'Symbol is required').max(20, 'Symbol must be less than 20 characters'),
});

export const updateBookmarkSchema = createBookmarkSchema.partial();

// User update validation schemas
export const updateEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateBookmarkInput = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>; 