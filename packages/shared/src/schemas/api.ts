/**
 * Base properties present in every API response
 */
interface BaseResponse {
  success: boolean;
  statusCode: number;
  message: string;
}

/**
 * Success Response Structure
 */
export interface ApiSuccessResponse<T> extends BaseResponse {
  success: true;
  data: T;
  stack?: never; // Ensures stack is never present on success
}

/**
 * Error Response Structure
 */
export interface ApiErrorResponse extends BaseResponse {
  success: false;
  data?: never; // Ensures data is never present on error
  stack?: string; // Only populated in development
  errors?: Record<string, string[]>; // Optional field for Zod validation errors
}

/**
 * Unified API Response Type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface ImportRepoResponse {
  repoId: string;
}
