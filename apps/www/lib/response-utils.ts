import { NextResponse } from "next/server";
import { ApiSuccessResponse, ApiErrorResponse } from "@understand-x/shared";

export function createSuccessResponse<T>(
  data: T, 
  message = "Success", 
  status = 200
) {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    statusCode: status,
    data,
  };
  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  message: string, 
  status = 500, 
  errors?: Record<string, string[]>
) {
  const response: ApiErrorResponse = {
    success: false,
    message,
    statusCode: status,
    errors,
  };
  return NextResponse.json(response, { status });
}