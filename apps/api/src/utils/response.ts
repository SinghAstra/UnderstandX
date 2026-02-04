import { ApiSuccessResponse } from "@understand-x/shared/src/schemas/api";
import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200
) => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
