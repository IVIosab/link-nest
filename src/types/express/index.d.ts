import "express";

declare module "express-serve-static-core" {
    interface Request {
    user?: {
      id: string;
    };
    link?: {
      id: string;
      shortSlug: string;
      originalUrl: string;
      createdBy: string;
      createdAt: string;
      expiresAt?: string | null;
      clickCount: number;
      passwordHash?: string | null;
    };
  }
}