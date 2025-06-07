import rateLimit from "express-rate-limit";

// Default rate limiter: 100 requests per 15 minutes
export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    message: "Too many requests, please try again later.",
});

// Specific limiter for shortening endpoint (e.g., 10 per 10 mins)
export const shortenLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "You have exceeded the link creation limit. Try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many SignIn/SignUp requests, please try again later.",
});