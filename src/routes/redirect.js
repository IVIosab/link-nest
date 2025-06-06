import { db } from "../db/index.js";
import { links, visits } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

// Helper to get request metadata
function getRequestInfo(req) {
    return {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || "Unknown",
        referrer: req.get("referrer") || null,
        country: null, // Could use a GeoIP service here
    };
}

export async function handleRedirect(req, res) {
    const slug = req.params.slug;
    const found = await db.select().from(links).where(eq(links.shortSlug, slug)).limit(1);

    if (found.length === 0) {
        return res.status(404).send("Short link not found.");
    }

    const link = found[0];

    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return res.status(410).send("Link has expired.");
    }

    if (link.passwordHash) {
        const { password } = req.query;
        if (!password) {
            return res.status(401).send("Password required.");
        }

        const valid = await bcrypt.compare(password, link.passwordHash);
        if (!valid) {
            return res.status(403).send("Invalid password.");
        }
    }

    const { ipAddress, userAgent, referrer, country } = getRequestInfo(req);
    await db.insert(visits).values({
        id: nanoid(),
        linkId: link.id,
        ipAddress,
        userAgent,
        referrer,
        country,
        clickedAt: new Date(),
    });

    await db
        .update(links)
        .set({ clickCount: sql`${links.clickCount} + 1` })
        .where(eq(links.id, link.id));


    return res.redirect(link.originalUrl);
}
