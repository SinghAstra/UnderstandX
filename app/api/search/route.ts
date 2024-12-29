import { authOptions } from "@/lib/auth/auth-options";
import { generateEmbedding } from "@/lib/utils/gemini";
import { prisma } from "@/lib/utils/prisma";
import { cosineSimilarity } from "@/lib/utils/utils";
import { SimilarChunk } from "@/types/search-result";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const SIMILARITY_THRESHOLD = 0.6; // Adjust based on testing
const PAGE_SIZE = 10;

export async function POST(
  req: Request
): Promise<
  | NextResponse<{ similarChunks: SimilarChunk[] }>
  | NextResponse<{ message: string }>
> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { query, repositoryId, filters } = body;

    console.log("query is ", query);
    console.log("repositoryId is ", repositoryId);
    console.log("filters is ", filters);

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

    // Generate embeddings for the search query
    const queryEmbeddings = await generateEmbedding(query);

    console.log("queryEmbeddings.length is ", queryEmbeddings.length);

    // Build the base query
    const chunks = await prisma.repositoryChunk.findMany({
      where: {
        repositoryId: repositoryId,
        repository: {
          userId: session.user.id,
        },
      },
      include: {
        repository: {
          select: {
            name: true,
            fullName: true,
          },
        },
      },
    });

    console.log("chunks.length is ", chunks.length);

    // Calculate similarity scores and rank results
    const similarChunks = chunks
      .map((chunk) => {
        const similarity = cosineSimilarity(queryEmbeddings, chunk.embeddings);
        return {
          ...chunk,
          similarity,
        };
      })
      .filter((result) => result.similarity > SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, PAGE_SIZE);

    return NextResponse.json({
      similarChunks: similarChunks.map((similarChunk) => ({
        id: similarChunk.id,
        filepath: similarChunk.filepath,
        type: similarChunk.type,
        repositoryName: similarChunk.repository.name,
        repositoryFullName: similarChunk.repository.fullName,
        content: similarChunk.content,
        similarity: similarChunk.similarity,
      })),
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
