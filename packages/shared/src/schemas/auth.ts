/**
 * Constants for Service-to-Service Authentication
 */
export const INTERNAL_AUTH_KEYS = {
  PURPOSE: "internal_service_request",
} as const;

/**
 * Interface for the Internal JWT Payload
 * This ensures that when Next.js signs it, Express knows exactly what to expect.
 */
export interface InternalJwtPayload {
  userId: string;
  purpose: typeof INTERNAL_AUTH_KEYS.PURPOSE;
}
