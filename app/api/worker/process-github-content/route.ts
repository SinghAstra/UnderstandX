import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { fetchGithubContent } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { qStash } from "@/lib/utils/qstash";
import { RepositoryStatus } from "@prisma/client";
import { Receiver } from "@upstash/qstash";
import { NextRequest, NextResponse } from "next/server";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
});

export async function POST(req: NextRequest) {
  const signature = req.headers.get("upstash-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 401 }
    );
  }

  console.log("In --/api/worker/process-github-content");

  // Get the raw body
  const body = await req.text();

  // Verify the signature
  const isValid = await receiver.verify({
    body,
    signature,
    url: `${process.env.APP_URL}/api/worker/process-github-content`,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { owner, repo, repositoryId, path } = JSON.parse(body);

  console.log("owner is ", owner);
  console.log("repo is ", repo);
  console.log("repositoryId is ", repositoryId);
  console.log("path is ", path);

  try {
    // Fetch only the current directory level (do NOT recurse)
    const items = await fetchGithubContent(owner, repo, path, repositoryId);

    // Notify frontend that this directory is being processed
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Processing directory: ${path || "root"}`,
    });

    const directories = items.filter((item) => item.type === "dir");
    const files = items.filter((item) => item.type === "file");

    // Save directories in parallel
    const directoryMap = new Map();
    await Promise.all(
      directories.map(async (dir) => {
        const parentPath = dir.path.split("/").slice(0, -1).join("/");
        const parentDir = directoryMap.get(parentPath);

        const directory = await prisma.directory.create({
          data: {
            path: dir.path,
            repositoryId,
            parentId: parentDir?.id || null,
          },
        });

        console.log("Directory Created", dir);

        directoryMap.set(dir.path, directory);
      })
    );

    console.log("directoryMap is ", directoryMap);

    // Save files in parallel
    await Promise.all(
      files.map(async (file) => {
        const pathParts = file.path.split("/");
        pathParts.pop();
        const dirPath = pathParts.join("/");
        const directory = directoryMap.get(dirPath);

        await prisma.file.create({
          data: {
            path: file.path,
            name: file.name,
            content: file.content || "",
            repositoryId,
            directoryId: directory?.id || null,
          },
        });
      })
    );

    // Notify user about saved files
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Saved ${files.length} files in ${path || "root"}`,
    });

    await Promise.all(
      directories.map(
        async (dir) =>
          await qStash.publishJSON({
            url: `${process.env.APP_URL}/api/worker/process-github-content`,
            body: { owner, repo, repositoryId, path: dir.path },
            retries: 3,
          })
      )
    );

    // Notify user that this directory is fully processed
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `Finished processing directory: ${path || "root"}`,
    });

    return NextResponse.json({ status: "SUCCESS", processed: items.length });
  } catch (error) {
    console.log("Error Occurred in  --/api/worker/process-github-content");
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }

    await prisma.repository.update({
      where: { id: repositoryId },
      data: { status:  RepositoryStatus.FAILED },
    });

    // Notify user about failure
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.FAILED,
      message: `Failed to process directory: ${path || "root"}`,
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
