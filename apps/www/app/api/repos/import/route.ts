import { env } from "@/env";
import { authOptions } from "@/lib/auth-options";
import { logError } from "@/lib/log-error";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/response-utils";
import {
  ApiResponse,
  ImportRepoResponse,
  INTERNAL_AUTH_KEYS,
  InternalJwtPayload,
} from "@understand-x/shared";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

/**
 * POST /api/repos/import
 * Secure Bridge between Client and Express API
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the User Session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return createErrorResponse("Unauthorized: Please sign in again.", 401);
    }

    // 2. Parse and Validate the Incoming Body
    const body = await req.json();
    if (!body.repoUrl) {
      return createErrorResponse("Repository URL is required.", 400);
    }

    // 3. Environment Variable Checks
    const JWT_SECRET = env.JWT_SECRET;
    const API_URL = env.API_URL;

    if (!JWT_SECRET || !API_URL) {
      throw new Error(
        "Missing required environment variables (JWT_SECRET or API_URL)"
      );
    }

    // 4. Generate Internal Service Token
    const payload: InternalJwtPayload = {
      userId: session.user.id,
      purpose: INTERNAL_AUTH_KEYS.PURPOSE,
    };

    const internalToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "60s" });

    // 5. Forward Request to Express API
    // We expect the Express API to return a standardized ApiResponse
    const { data: expressData } = await axios.post<
      ApiResponse<ImportRepoResponse>
    >(`${API_URL}/api/repos/import`, body, {
      headers: {
        Authorization: `Bearer ${internalToken}`,
        "Content-Type": "application/json",
      },
    });

    // 6. Return Generalized Response based on Express outcome
    if (expressData.success) {
      return createSuccessResponse<ImportRepoResponse>(
        expressData.data,
        expressData.message,
        202 // Accepted
      );
    }

    return createErrorResponse(
      expressData.message,
      expressData.statusCode,
      expressData.errors
    );
  } catch (error: any) {
    logError(error);

    return createErrorResponse("Internal Server Error", 500);
  }
}
