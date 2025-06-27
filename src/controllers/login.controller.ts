import { Request, Response } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema";
import { emailPasswordSchema } from "../utils/zod.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function loginUser (req: Request, res: Response): Promise<void>{
    const parseResult = emailPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.flatten() });
        return;
    }

    const { email, password } = parseResult.data;

    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then(rows => rows[0]);

    if (!user) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
    }

    const payload = {
        sub: user.id,
        email: user.email,
    };

    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET not set in environment");
    }

    const token = jwt.sign(payload, jwtSecret, {
        expiresIn: "1h",
    });

    res.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
    });
}
