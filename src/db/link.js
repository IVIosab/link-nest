import { z } from "zod";

export const createLinkSchema = z.object({
    originalUrl: z.string().url(),
    customSlug: z.string().min(3).max(32).optional(),
    expiresAt: z.coerce.date().optional(),
    password: z.string().min(4).max(64).optional(),
});
