import { prisma } from "@/lib/utils/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Safety check: only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "This route is only available in development environment" },
        { status: 403 }
      );
    }

    // Then delete all repositories
    await prisma.repository.deleteMany({});

    return NextResponse.json(
      {
        message:
          "All repositories and their chunks have been deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting repositories:", error);
    return NextResponse.json(
      { error: "Failed to delete repositories" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
