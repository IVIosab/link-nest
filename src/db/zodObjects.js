import { z } from "zod";

export const emailPasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createLinkSchema = z.object({
    originalUrl: z.string().url(),
    customSlug: z.string().min(3).max(32).optional(),
    expiresAt: z.coerce.date().optional(),
    password: z.string().min(4).max(64).optional(),
});

export const slugParamSchema = z.object({
    slug: z.string().min(3),
});