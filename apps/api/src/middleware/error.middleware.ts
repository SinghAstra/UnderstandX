import { env } from "@/config/env";
import { AppError } from "@/utils/AppError";
import { logError } from "@/utils/logger";
import { ApiErrorResponse, ApiResponse } from "@understand-x/shared";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err);

  let statusCode = err instanceof AppError ? err.statusCode : 500;
  let message = err.message || "Internal Server Error";
  let errors: Record<string, string[]> | undefined = undefined;

  // Handle Zod Validation Errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation Error";
    errors = err.flatten().fieldErrors;
  }

  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    // Add validation errors if they exist
    ...(errors && { errors }),
    // Include stack trace only in development mode
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};
