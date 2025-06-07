import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { emailPasswordSchema } from "../db/zodObjects.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

export async function handleRegister(req, res) {
    const parseResult = emailPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { email, password } = parseResult.data;

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return res.status(409).json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
        id: nanoid(),
        email,
        hashedPassword,
        createdAt: new Date(),
    });

    return res.status(201).json({ message: "User registered successfully." });
}
