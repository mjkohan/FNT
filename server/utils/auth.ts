import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserWithoutPassword } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: UserWithoutPassword): string => {
  const payload: { id: number; email: string } = { 
    id: user.id, 
    email: user.email 
  };
  
  return jwt.sign(
    payload,
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const excludePassword = (user: User): UserWithoutPassword => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}; 