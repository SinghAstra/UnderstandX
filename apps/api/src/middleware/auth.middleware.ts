import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { INTERNAL_AUTH_KEYS, InternalJwtPayload } from "@understand-x/shared";
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
  // 1. Extract the Bearer token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError(401, "Internal Access Denied: Missing Authorization Header")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token using the SHARED secret
    // This ensures the request is actually coming from your Next.js server
    const decoded = jwt.verify(token, env.JWT_SECRET) as InternalJwtPayload;

    // 3. Security Check: Ensure the token purpose matches
    if (decoded.purpose !== INTERNAL_AUTH_KEYS.PURPOSE) {
      return next(new AppError(401, "Security Alert: Invalid Token Purpose"));
    }

    // 4. Populate req.user with the ID provided by the Next.js Bridge
    req.user = {
      id: decoded.userId,
    };

    console.log(
      `[AUTH]: Internal request verified for User: ${decoded.userId}`
    );
    next();
  } catch (err: any) {
    // Handle expired or tampered tokens
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError(401, "Internal Token Expired: Please retry request")
      );
    }

    return next(new AppError(401, "Invalid Internal Token"));
  }
};
