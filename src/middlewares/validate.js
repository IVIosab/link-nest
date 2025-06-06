export function validate({ body: bodySchema, params: paramsSchema }) {
    return (req, res, next) => {
        if (bodySchema) {
            const result = bodySchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({
                    error: "Invalid request body",
                    details: result.error.flatten(),
                });
            }
            req.body = result.data;
        }

        if (paramsSchema) {
            const result = paramsSchema.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json({
                    error: "Invalid URL parameters",
                    details: result.error.flatten(),
                });
            }
            req.params = result.data;
        }

        next();
    };
}
