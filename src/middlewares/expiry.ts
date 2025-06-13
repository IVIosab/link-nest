import { Request, Response, NextFunction } from "express";
import { db } from "../db/index.js";
import { links } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { Link } from "../db/types.js";

export async function checkExpiry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { slug } = req.params;

    const found = await db
        .select()
        .from(links)
        .where(eq(links.shortSlug, slug))
        .limit(1);

    if (found.length === 0) {
        res.status(404).send("Short link not found.");
        return;
    }

    const link = found[0];

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        await db
            .delete(links)
            .where(eq(links.id, link.id));
        res.status(410).send("This link has expired.");
        return;
    }
    req.link = link;
    next();
}