import { Request, Response, NextFunction } from "express";
import { authenticate } from "passport";

export const verifyJwtTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  authenticate("jwt", (error, decryptToken, info) => {
    console.log(error, decryptToken, info);

    if (info.name === "TokenExpiredError") info.status = 401;
    if (info.name === "JsonWebTokenError") info.status = 401;
    if (info.name === "Error") info.status = 401;
    // if (error || !user) return res.negotiate(error || info);
    // req.user = user;

    next();
  })(req, res);
};
