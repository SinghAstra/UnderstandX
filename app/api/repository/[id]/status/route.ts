import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type Props = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, props: Props) {
  const { id } = await props.params;
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  };

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  console.log("id --19 before monitorRepository is ", id);
  // Start monitoring repository status
  void monitorRepository(id, writer, encoder);

  return new NextResponse(stream.readable, { headers });
}

async function monitorRepository(
  repoId: string,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) {
  let lastStatus: RepositoryStatus | null = null;

  try {
    while (true) {
      const repository = await prisma.repository.findUnique({
        where: { id: repoId },
        select: {
          id: true,
          name: true,
          status: true,
          updatedAt: true,
        },
      });

      if (!repository) {
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              error: "Repository not found",
              status: "error",
            })}\n\n`
          )
        );
        break;
      }

      // Only send update if status has changed
      if (lastStatus !== repository.status) {
        await writer.write(
          encoder.encode(
            `data: ${JSON.stringify({
              id: repository.id,
              status: repository.status,
              name: repository.name,
              updatedAt: repository.updatedAt,
            })}\n\n`
          )
        );

        lastStatus = repository.status;
      }

      // Break the loop if we reach a terminal status
      if (
        repository.status === "SUCCESS" ||
        repository.status === "CANCELED" ||
        repository.status === "FETCHING_GITHUB_REPO_FILES_FAILED" ||
        repository.status === "CHUNKING_FILES_FAILED" ||
        repository.status === "EMBEDDING_CHUNKS_FAILED"
      ) {
        break;
      }

      // Check for updates every second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("Error monitoring repository:", error);
    await writer.write(
      encoder.encode(
        `data: ${JSON.stringify({
          error: "Repository monitoring failed",
          status: "error",
        })}\n\n`
      )
    );
  } finally {
    await writer.close();
  }
}
