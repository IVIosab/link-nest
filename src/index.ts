import express, { Request, Response } from "express";
import router from "./routes";
import { generalRateLimiter, logger } from "./middlewares";

const app = express();
const PORT = process.env.PORT || 3000;

// for testing purposes only to be able to use ngrok
// app.enable('trust proxy') 

app.use(logger);
app.use(generalRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to LinkNest API!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
