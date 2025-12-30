import { env } from "@/env";
import { authOptions } from "@/lib/auth-options";
import { logError } from "@/lib/log-error";
import {
  ApiResponse,
  ImportRepoResponse,
  INTERNAL_AUTH_KEYS,
  InternalJwtPayload,
} from "@understand-x/shared";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/repos/import
 * Secure Bridge between Client and Express API
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the User Session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please sign in again." },
        { status: 401 }
      );
    }

    // 2. Parse and Validate the Incoming Body
    const body = await req.json();
    if (!body.repoUrl) {
      return NextResponse.json(
        { success: false, message: "Repository URL is required." },
        { status: 400 }
      );
    }

    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET : Missing ENV");
    }

    const payload: InternalJwtPayload = {
      userId: session.user.id,
      purpose: INTERNAL_AUTH_KEYS.PURPOSE,
    };

    // 3. Generate a Short-Lived Internal Service Token (Next.js -> Express)
    const internalToken = jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "60s" } // Extremely short expiration for security
    );

    const API_URL = env.API_URL;
    if (!API_URL) {
      throw new Error("API_URL : Missing ENV");
    }

    // 4. Forward Request to Express API

    const { data: expressData } = await axios.post<
      ApiResponse<ImportRepoResponse>
    >(
      `${API_URL}/api/repos/import`,
      body, // The original payload (repoUrl)
      {
        headers: {
          Authorization: `Bearer ${internalToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (expressData.success) {
      return NextResponse.json(expressData.data, { status: 202 });
    }
    return NextResponse.json(
      { message: expressData.message },
      { status: expressData.statusCode }
    );
  } catch (error) {
    logError(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
