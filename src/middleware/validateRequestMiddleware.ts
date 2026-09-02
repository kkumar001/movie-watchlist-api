import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateRequestMiddleware = (schema: z.ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errorMessages = result.error.issues.map((issue) => issue.message).join(", ");
            return res.status(400).json({
                status: 400,
                message: errorMessages,
                data: null
            })
        }

        next();
    }
}