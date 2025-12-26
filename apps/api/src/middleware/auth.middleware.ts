import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError(401, "Authorization header is missing or invalid.")
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new AppError(401, "Token is missing from the authorization header.")
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    console.log("decoded is ", decoded);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return next(new AppError(401, "Invalid or expired token."));
  }
};
