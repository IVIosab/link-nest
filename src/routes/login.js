import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { emailPasswordSchema } from "../db/zodObjects.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function handleLogin (req, res){
    const parseResult = emailPasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.flatten() });
    }

    const { email, password } = parseResult.data;

    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
        .then(rows => rows[0]);

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password." });
    }

    const payload = {
        sub: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    return res.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
    });
}
