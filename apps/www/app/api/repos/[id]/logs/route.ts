import { logError } from "@/lib/log-error";
import {
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/response-utils";
import { LogResponse } from "@understand-x/shared";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Fetch from Express
    const response = await fetch(
      `${process.env.API_URL}/api/repos/${params.id}/logs`
    );
    const result = await response.json();

    if (!response.ok) {
      return createErrorResponse(
        result.message || "Failed to fetch",
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
