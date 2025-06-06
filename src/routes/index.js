import express from "express";
import { createShortLink } from "./shorten.js";
import { handleRedirect } from "./redirect.js";

const router = express.Router();

router.post("/shorten", createShortLink);
router.get("/:slug", handleRedirect);

export default router;
