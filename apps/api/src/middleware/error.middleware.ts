import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { logError } from "@/utils/logger";
import { ApiResponse } from "@understand-x/shared";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  const response: ApiResponse = {
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(statusCode).json(response);
};
