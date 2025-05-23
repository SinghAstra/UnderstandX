import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(
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

    return Response.json({
      repository: repository,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }

    return Response.json(
      { message: "Failed to process repository" },
      { status: 500 }
    );
  }
}
