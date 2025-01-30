import redis from "@/lib/utils/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const testValue = await redis.get("test-key");

    return NextResponse.json({
      status: "success",
      message: "Redis connection successful",
      testValue: testValue,
    });
  } catch (error) {
    console.log("Redis GET error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Redis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
