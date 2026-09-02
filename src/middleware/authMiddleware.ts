import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../../prisma/db";

interface AuthTokenPayload extends JwtPayload {
    id: string;
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]

    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt
    }
    
    if (!token) {
        return res.status(401).json({
            status: 201,
            message: "Unauthorized user!",
            data: null
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthTokenPayload;

        const user = await db.orm.public.User.where({
            id: decoded?.id
        }).first();

        if (!user) {
            return res.status(404).json({
                status: 201,
                message: "User not found!",
                data: null
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 201,
            message: "Unauthorized user!",
            data: null
        })
    }
}