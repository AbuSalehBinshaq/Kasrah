import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertUserSchema, insertUserSessionSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  static async createSession(userId: string): Promise<string> {
    const token = this.generateToken(userId);
    const expiresAt = new Date(Date.now() + SESSION_DURATION);

    await storage.createUserSession({
      userId,
      token,
      expiresAt,
    });

    return token;
  }

  static async validateSession(token: string): Promise<any> {
    const session = await storage.getUserSession(token);
    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const user = await storage.getUser(session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  static async login(username: string, password: string): Promise<{ user: any; token: string } | null> {
    const user = await storage.getUserByUsername(username);
    if (!user || !user.isActive) {
      return null;
    }

    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    const token = await this.createSession(user.id);
    await storage.updateUserLastLogin(user.id);

    return { user, token };
  }

  static async register(userData: z.infer<typeof insertUserSchema>): Promise<{ user: any; token: string }> {
    const hashedPassword = await this.hashPassword(userData.password);
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });

    const token = await this.createSession(user.id);
    return { user, token };
  }

  static async logout(token: string): Promise<void> {
    await storage.deleteUserSession(token);
  }
}

// Middleware for authentication
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  const user = await AuthService.validateSession(token);
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  next();
};

// Middleware for role-based access control
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};

// Middleware for admin access
export const requireAdmin = requireRole(["admin"]);

// Middleware for editor access
export const requireEditor = requireRole(["admin", "editor"]); 