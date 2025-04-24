import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const repository = await prisma.repository.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        directories: true,
        files: true,
      },
    });

    // 6. Fetch repository details and data
    return NextResponse.json({
      repository: repository,
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
