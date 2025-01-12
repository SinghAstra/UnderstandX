import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("id is ", id);
    console.log("session.user.id is ", session.user.id);

    // Fetch repository with user check
    const repository = await prisma.repository.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    // If repository doesn't exist or doesn't belong to user
    if (!repository) {
      return new NextResponse("Repository not found", { status: 404 });
    }

    return NextResponse.json({
      repository,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error:", error);
    }
    console.log("error -- get /repository/:repositoryId");
    return new NextResponse("Internal error", { status: 500 });
  }
}
