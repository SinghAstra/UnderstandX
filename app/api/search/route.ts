import { authOptions } from "@/lib/auth/auth-options";
import { generateEmbedding } from "@/lib/utils/gemini";
import { prisma } from "@/lib/utils/prisma";
import { cosineSimilarity } from "@/lib/utils/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Helper to highlight matching text
function highlightText(text: string, query: string): string {
  const regex = new RegExp(query, "gi");
  return text.replace(regex, (match) => `<mark>${match}</mark>`);
}

export async function POST(req: Request) {
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
    const results = chunks
      .map((chunk) => {
        const similarity = cosineSimilarity(queryEmbeddings, chunk.embeddings);
        const highlightedContent = highlightText(chunk.content, query);
        // console.log("similarity is ", similarity);
        // console.log("highlightedContent is ", highlightedContent);
        return {
          ...chunk,
          similarity,
          highlightedContent,
        };
      })
      //   .filter((result) => result.similarity > 0.4)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10); // Return top 10 results

    // const sampleObj = {
    //   id: results[0].id,
    //   filepath: results[0].filepath,
    //   type: results[0].type,
    //   repositoryName: results[0].repository.name,
    //   content: results[0].highlightedContent,
    //   similarity: results[0].similarity,
    // };

    // console.log("sampleObj is ", sampleObj);

    // console.log("results is ", results);

    return NextResponse.json({
      results: results.map((result) => ({
        id: result.id,
        filepath: result.filepath,
        type: result.type,
        repositoryName: result.repository.name,
        content: result.highlightedContent,
        similarity: result.similarity,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
