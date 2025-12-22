import { ApiResponse } from "@understand-x/shared";
import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
