import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = { id: userId };

    next();
};