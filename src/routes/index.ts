import express from "express";
import { validate, checkExpiry, authenticateJWT, shortenLimiter, authLimiter } from "../middlewares";
import { createLinkSchema, slugParamSchema } from "../utils/zod.js";
import { loginUser } from "../controllers/login.controller.js";
import { registerUser } from "../controllers/register.controller.js";
import { shortenLink } from "../controllers/shorten.controller.js";
import { redirectLink } from "../controllers/redirect.controller.js";

const router = express.Router();

router.use('/login', authLimiter, loginUser);
router.use('/register', authLimiter, registerUser);
router.use('/shorten', authenticateJWT, shortenLimiter, validate({ body: createLinkSchema }), shortenLink);
router.use('/:slug', validate({ params: slugParamSchema }), checkExpiry, redirectLink);


export default router;
