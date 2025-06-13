import { db } from "../db/index.js";
import { links, visits } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import geoip from "geoip-lite";
import { Request, Response } from "express";

function getRequestInfo(req: Request) {
    const ip = req.ip || '0.0.0.0';
    const lookup = geoip.lookup(ip);
    return {
        ipAddress: ip,
        userAgent: req.headers["user-agent"] || "Unknown",
        referrer: req.get("referrer") || null,
        country: lookup?.country || null,
    };
}

export async function handleRedirect(req: Request, res: Response): Promise<void> {
    const link = req.link;
    if (!link) {
        res.status(404).send("Link not found.");
        return;
    }

    if (link.passwordHash) {
        const password = req.query.password as string;
        if (!password) {
            res.status(401).send("Password required.");
            return;
        }

        const valid = bcrypt.compare(password, link.passwordHash);
        if (!valid) {
            res.status(403).send("Invalid password.");
            return;
        }
    }

    const { ipAddress, userAgent, referrer, country } = getRequestInfo(req);
    await db.insert(visits).values({
        id: nanoid(),
        linkId: link.id,
        ipAddress: ipAddress,
        userAgent: userAgent,
        referrer: referrer,
        country: country,
    });

    const newCount = link.clickCount + 1;

    await db
        .update(links)
        .set({ clickCount: newCount })
        .where(eq(links.id, link.id));


    res.redirect(link.originalUrl);
}