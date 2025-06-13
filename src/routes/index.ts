import express from "express";
import { createShortLink } from "./shorten.js";
import { handleRedirect } from "./redirect.js";
import { validate } from "../middlewares/validate.js";
import { checkExpiry } from "../middlewares/expiry.js";
import { createLinkSchema, slugParamSchema } from "../db/zodObjects.js";
import { shortenLimiter, authLimiter } from "../middlewares/rateLimit.js";
import { authenticateJWT } from "../middlewares/auth.js";
import { handleRegister } from "./register.js";
import { handleLogin } from "./login.js";

const router = express.Router();

router.post("/shorten", authenticateJWT, shortenLimiter, validate({ body: createLinkSchema }), createShortLink);
router.get("/:slug", validate({ params: slugParamSchema }), checkExpiry, handleRedirect);
router.post("/register", authLimiter, handleRegister);
router.post("/login", authLimiter, handleLogin);

export default router;
