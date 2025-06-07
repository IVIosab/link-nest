import { db } from "../db/index.js";
import { links } from "../db/tables.js";
import { eq } from "drizzle-orm";

export async function checkExpiry(req, res, next) {
    const { slug } = req.params;

    const found = await db
        .select()
        .from(links)
        .where(eq(links.shortSlug, slug))
        .limit(1);

    if (found.length === 0) {
        return res.status(404).send("Short link not found.");
    }

    const link = found[0];

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return res.status(410).send("This link has expired.");
    }

    req.link = link;
    next();
}
