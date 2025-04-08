import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.deleteMany({});

    return NextResponse.json({
      users: users,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }

    return NextResponse.json(
      { message: "Failed to process repository" },
      { status: 500 }
    );
  }
}
