import { env } from "@/env";
import { authOptions } from "@/lib/auth-options";
import { logError } from "@/lib/log-error";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/response-utils";
import {
  INTERNAL_AUTH_KEYS,
  InternalJwtPayload,
  LogResponse,
} from "@understand-x/shared";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const JWT_SECRET = env.JWT_SECRET;
    const API_URL = env.API_URL;

    const session = await getServerSession(authOptions);

    if (!session) {
      return createErrorResponse("Unauthorized: Please sign in again.", 401);
    }

    //  Generate Internal Service Token
    const payload: InternalJwtPayload = {
      userId: session.user.id,
      purpose: INTERNAL_AUTH_KEYS.PURPOSE,
    };

    const internalToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "60s" });
    // 1. Fetch from Express
    const response = await fetch(`${env.API_URL}/api/repos/${id}/logs`, {
      headers: {
        Authorization: `Bearer ${internalToken}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    console.log("result is ", result);

    if (!response.ok) {
      return createErrorResponse(
        "Failed to fetch Logs. Please try again later.",
        response.status
      );
    }

    // 2. Return Generalized Success
    return createSuccessResponse<LogResponse[]>(result.data);
  } catch (error) {
    logError(error);
    return createErrorResponse("Internal Server Error", 500);
  }
}
