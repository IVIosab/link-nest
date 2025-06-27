import { db } from "../db/index.js";
import { users } from "../db/schema";
import { emailPasswordSchema } from "../utils/zod.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

export async function registerUser(req: Request, res: Response): Promise<void> {
    const parseResult = emailPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json({ error: parseResult.error.flatten() });
        return;
    }

    const { email, password } = parseResult.data;

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        res.status(409).json({ error: "Email is already registered." });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        id: nanoid(),
        email,
        hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully." });
}
