export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string; // Used for both Success and Error descriptions
  data?: T; // Result for success
  stack?: string; // Only for dev debugging
}

export * from "./schemas/repo";
