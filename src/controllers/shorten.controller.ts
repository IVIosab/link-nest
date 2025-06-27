import { db } from "../db/index.js";
import { links } from "../db/schema";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { createLinkSchema } from "../utils/zod.js";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function shortenLink(req: Request, res: Response): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const userId = req.user.id;
    const parseResult = createLinkSchema.safeParse(req.body);

    if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.flatten() });
        return;
    }

    const { originalUrl, customSlug, expiresAt, password } = parseResult.data;
    const shortSlug = customSlug || nanoid(8);

    const slugExists = await db
        .select()
        .from(links)
        .where(eq(links.shortSlug, shortSlug));

    if (slugExists.length > 0) {
        res.status(409).json({ error: "Slug already in use." });
        return;
    }

    const passwordHash = password
        ? await bcrypt.hash(password, 10)
        : null;

    await db.insert(links).values({
        id: nanoid(),
        originalUrl: originalUrl,
        shortSlug: shortSlug,
        createdBy: userId,
        ...(expiresAt && {expiresAt: expiresAt.toISOString()}),
        ...(passwordHash && {passwordHash: passwordHash}),
    });

    res.status(201).json({
        shortUrl: `${req.protocol}://${req.get("host")}/${shortSlug}`,
    });
    return;
}