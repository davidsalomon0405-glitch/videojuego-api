
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({ mensaje: "Token no proporcionado" });
        return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
        res.status(500).json({ mensaje: "Error de configuración del servidor" });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;

        if (typeof decoded.id !== "number") {
            res.status(403).json({ mensaje: "Token inválido" });
            return;
        }

        req.userId = decoded.id;
        next();

    } catch {
        res.status(403).json({ mensaje: "Token inválido o expirado" });
    }
};
