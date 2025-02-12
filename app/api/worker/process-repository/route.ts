import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { parseGithubUrl } from "@/lib/utils/github";
import logger from "@/lib/utils/logger";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// const receiver = new Receiver({
//   currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
//   nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
// });

export async function POST(req: NextRequest) {
  const startTime = Date.now(); // End time
  // Get the raw body
  const { repositoryId, githubUrl } = await req.json();

  try {
    const { owner, repo, isValid } = parseGithubUrl(githubUrl);

    if (!isValid || !owner) {
      throw new Error("Invalid GitHub URL");
    }

    await prisma.repository.update({
      where: { id: repositoryId },
      data: {
        status: RepositoryStatus.PROCESSING,
      },
    });

    // Send update to frontend that processing has started
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Started processing repository: ${repo}`,
    });

    (async () => {
      try {
        const response = await fetch(
          `${process.env.APP_URL}/api/worker/process-github-content`,
          {
            method: "POST",
            body: JSON.stringify({ owner, repo, repositoryId, path: "" }),
            headers: { "Content-Type": "application/json" },
            keepalive: true,
          }
        );
        if (!response.ok) {
          throw new Error(
            "Error occurred while trying to start background Process in /api/worker/process-repository."
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log("Error message:", error.message);
          console.log("Error stack:", error.stack);
        } else {
          console.log(
            "Failed to complete background processing in /api/worker/process-repository :",
            error
          );
        }
      }
    })();

    const endTime = Date.now(); // End time
    logger.success(
      `API response time for /api/worker/process-repository : ${
        endTime - startTime
      } seconds`
    );

    return NextResponse.json({ message: "Started Processing Repository" });
  } catch (error) {
    console.log("Error Occurred in  --/api/worker/process-repository");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    // Notify user about failure
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.FAILED,
      message: `Failed to process repository.`,
    });

    // Update status to failed
    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status: RepositoryStatus.FAILED },
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
