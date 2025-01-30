import redis from "@/lib/utils/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await redis.set(
      "test-key",
      "This is value of test-key from production vercel"
    );

    const storedValue = await redis.get("test-key");

    return NextResponse.json({
      status: "success",
      message: "Value stored successfully",
      storedValue,
    });
  } catch (error) {
    console.error("Redis SET error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to store value in Redis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
