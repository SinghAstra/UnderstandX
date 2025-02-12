import {
  handleLargeFileSet,
  processFilesDirectly,
} from "@/app/api/worker/process-github-content/route";
import { GitHubContent } from "@/interfaces/github";
import { sendProcessingUpdate } from "@/lib/pusher/send-update";
import { SMALL_FILES_THRESHOLD } from "@/lib/utils/constant";
import { fetchGithubContent, parseGithubUrl } from "@/lib/utils/github";
import { prisma } from "@/lib/utils/prisma";
import { RepositoryStatus } from "@prisma/client";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
export const dynamic = "force-dynamic";

const ProcessRepositorySchema = z.object({
  githubUrl: z.string(),
  userId: z.string(),
  repositoryId: z.string(),
});

const ProcessGithubContentSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  repositoryId: z.string(),
  path: z.string(),
});

const ProcessFileBatchSchema = z.object({
  batch: z.array(z.custom<GitHubContent>()),
  repositoryId: z.string(),
  currentPath: z.string(),
  directoryId: z.string().nullable(),
  batchNumber: z.number(),
  totalBatches: z.number(),
});
export const processRepository = schemaTask({
  id: "process-repository",
  schema: ProcessRepositorySchema,
  run: async (payload) => {
    const { githubUrl, repositoryId } = payload;
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

      await processGithubContent.trigger({
        owner: owner,
        repo,
        repositoryId,
        path: "",
      });
    } catch (error) {
      console.log("Error Occurred in  processRepository Task");
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
    }
  },
});

export const processGithubContent = schemaTask({
  id: "process-github-content",
  schema: ProcessGithubContentSchema,
  run: async (payload) => {
    const { owner, repo, repositoryId, path } = payload;
    try {
      // Fetch only the current directory level (do NOT recurse)
      const items = await fetchGithubContent(owner, repo, path, repositoryId);

      // Send update to frontend that processing has completed
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

      await Promise.all(
        directories.map(
          async (dir) =>
            await processGithubContent.trigger({
              owner,
              repo,
              repositoryId,
              path: dir.path,
            })
        )
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
    } catch (error) {
      console.log("Error Occurred in  processGithubContent Task");
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
    }
  },
});

export const processFileBatch = schemaTask({
  id: "process-file-batch",
  schema: ProcessFileBatchSchema,
  run: async (payload) => {
    const {
      batch,
      repositoryId,
      directoryId,
      currentPath,
      batchNumber,
      totalBatches,
    } = payload;
    try {
      await Promise.all(
        batch.map(async (file: GitHubContent) => {
          await prisma.file.create({
            data: {
              path: file.path,
              name: file.name,
              content: file.content || "",
              repositoryId,
              directoryId,
            },
          });
        })
      );

      await sendProcessingUpdate(repositoryId, {
        status: RepositoryStatus.PROCESSING,
        message: `Processed batch ${batchNumber}/${totalBatches} in ${
          currentPath || "root"
        }`,
      });
    } catch (error) {
      console.log("Error Occurred in  processFileBatch Task");
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
    }
  },
});
