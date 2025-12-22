// Standard API Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string; // Used for both Success and Error descriptions
  data?: T; // Result for success
  stack?: string; // Only for dev debugging
}
// Common Domain Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}
