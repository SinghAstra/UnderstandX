import { GitHubContent } from "@/interfaces/github";
import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { FILE_BATCH_SIZE, SMALL_FILES_THRESHOLD } from "@/lib/utils/constant";
import { fetchGithubContent } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// const receiver = new Receiver({
//   currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
//   nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
// });

export async function POST(req: NextRequest) {
  const { owner, repo, repositoryId, path } = await req.json();

  console.log(`Processing GitHub content for repo: ${repo}, path: ${path}`);

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

    // Get directoryId for current path
    const pathParts = files[0]?.path.split("/") || [];
    pathParts.pop();
    const dirPath = pathParts.join("/");
    const directoryId = directoryMap.get(dirPath)?.id || null;

    sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.PROCESSING,
      message: `DirectoryId is ${directoryId}`,
    });

    if (files.length <= SMALL_FILES_THRESHOLD) {
      // Process files directly if count is small
      await processFilesDirectly(files, repositoryId, path, directoryId);
    } else {
      // Split into batches and queue for processing
      await handleLargeFileSet(files, repositoryId, path, directoryId);
    }

    await Promise.all(
      directories.map(async (dir) =>
        // await qStash.publishJSON({
        //   url: `${process.env.APP_URL}/api/worker/process-github-content`,
        //   body: { owner, repo, repositoryId, path: dir.path },
        //   retries: 3,
        // })
        fetch(`${process.env.APP_URL}/api/worker/process-github-content`, {
          method: "POST",
          body: JSON.stringify({ owner, repo, repositoryId, path: dir.path }),
          headers: { "Content-Type": "application/json" },
          keepalive: true, // Fire-and-forget
        }).catch((err) =>
          console.error("Failed to trigger content processing:", err)
        )
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
      data: { status: RepositoryStatus.FAILED },
    });

    // Notify user about failure
    await sendProcessingUpdate(repositoryId, {
      status: RepositoryStatus.FAILED,
      message: `Failed to process directory: ${path || "root"}`,
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function processFilesDirectly(
  files: GitHubContent[],
  repositoryId: string,
  currentPath: string,
  directoryId: string
) {
  sendProcessingUpdate(repositoryId, {
    status: RepositoryStatus.PROCESSING,
    message: "In process files Directly",
  });
  await Promise.all(
    files.map(async (file) => {
      await prisma.file.create({
        data: {
          path: file.path,
          name: file.name,
          content: file.content || "",
          repositoryId,
          directoryId: directoryId,
        },
      });
    })
  );

  // Notify user about saved files
  // ${"path" || "root"}
  await sendProcessingUpdate(repositoryId, {
    status: RepositoryStatus.PROCESSING,
    message: `Saved ${files.length} files in ${currentPath}`,
  });
}

async function handleLargeFileSet(
  files: GitHubContent[],
  repositoryId: string,
  currentPath: string,
  directoryId: string | null
) {
  await sendProcessingUpdate(repositoryId, {
    status: RepositoryStatus.PROCESSING,
    message: `Processing ${files.length} files in batches for ${
      currentPath || "root"
    }`,
  });

  const batches = [];
  for (let i = 0; i < files.length; i += FILE_BATCH_SIZE) {
    batches.push(files.slice(i, i + FILE_BATCH_SIZE));
  }

  await Promise.all(
    batches.map(async (batch, index) => {
      fetch(`${process.env.APP_URL}/api/worker/process-file-batch`, {
        method: "POST",
        body: JSON.stringify({
          batch,
          repositoryId,
          directoryId,
          currentPath,
          batchNumber: index + 1,
          totalBatches: batches.length,
        }),
        headers: { "Content-Type": "application/json" },
        keepalive: true, // Fire-and-forget
      }).catch((err) =>
        console.error("Failed to trigger content processing:", err)
      );
      // await qStash.publishJSON({
      //   url: `${process.env.APP_URL}/api/worker/process-file-batch`,
      //   body: {
      //     batch,
      //     repositoryId,
      //     directoryId,
      //     currentPath,
      //     batchNumber: index + 1,
      //     totalBatches: batches.length,
      //   },
      //   retries: 3,
      // });
    })
  );
}
