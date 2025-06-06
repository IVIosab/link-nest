import { db } from "../db/index.js";
import { links } from "../db/schema.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { createLinkSchema } from "../db/link.js";
import { eq } from "drizzle-orm";

export async function createShortLink(req, res) {
    const userId = req.session?.user?.id || null;
    const parseResult = createLinkSchema.safeParse(req.body);

    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { originalUrl, customSlug, expiresAt, password } = parseResult.data;
    const shortSlug = customSlug || nanoid(8);

    const slugExists = await db
        .select()
        .from(links)
        .where(eq(links.shortSlug, shortSlug));

    if (slugExists.length > 0) {
        return res.status(409).json({ error: "Slug already in use." });
    }

    const passwordHash = password
        ? await bcrypt.hash(password, 10)
        : null;

    await db.insert(links).values({
        id: nanoid(),
        originalUrl,
        shortSlug,
        createdBy: userId,
        createdAt: new Date(),
        expiresAt: expiresAt ?? null,
        passwordHash,
        clickCount: 0,
    });

    return res.status(201).json({
        shortUrl: `${req.protocol}://${req.get("host")}/${shortSlug}`,
    });
}
