import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validate({ body: bodySchema, params: paramsSchema }: { body?: ZodSchema, params?: ZodSchema }): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (bodySchema) {
            const result = bodySchema.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    error: "Invalid request body",
                    details: result.error.flatten(),
                });
                return;
            }
            req.body = result.data;
        }

        if (paramsSchema) {
            const result = paramsSchema.safeParse(req.params);
            if (!result.success) {
                res.status(400).json({
                    error: "Invalid URL parameters",
                    details: result.error.flatten(),
                });
                return;
            }
            req.params = result.data;
        }

        next();
    };
}