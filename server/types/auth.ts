import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: UserWithoutPassword;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: string;
} 