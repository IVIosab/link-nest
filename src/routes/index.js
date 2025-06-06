import express from "express";
import { createShortLink } from "./shorten.js";
import { handleRedirect } from "./redirect.js";
import { validate } from "../middlewares/validate.js";
import { checkExpiry } from "../middlewares/expiry.js";
import { createLinkSchema, slugParamSchema } from "../db/link.js";

const router = express.Router();

router.post("/shorten", validate({ body: createLinkSchema }), createShortLink);
router.get("/:slug", validate({ params: slugParamSchema }), checkExpiry, handleRedirect);

export default router;
