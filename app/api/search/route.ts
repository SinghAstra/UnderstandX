import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { query, repositoryId } = body;

    console.log("query is ", query);
    console.log("repositoryId is ", repositoryId);

    if (!query) {
      return NextResponse.json(
        { message: "Query is required" },
        { status: 400 }
      );
    }

    if (!repositoryId) {
      return NextResponse.json(
        { message: "RepositoryId is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Search Working Directory",
    });
  } catch (error) {
    console.log("Error while Performing Semantic Search on Repository");
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    } else {
      console.log("Unknown error:", error);
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
