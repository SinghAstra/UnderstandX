import { env } from "@/config/env";
import { QUEUES } from "@/constants/queues";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middleware/auth.middleware";
import { repositoryImportQueue } from "@/queue";
import { AppError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";
import { prisma, RepositoryStatus } from "@understand-x/database";
import {
  ImportRepoResponse,
  importRepoSchema,
  LogResponse,
} from "@understand-x/shared";
import axios from "axios";
import { Router } from "express";

const router = Router();

function parseGithubUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) return null;
    return { owner: pathParts[0], repo: pathParts[1] };
  } catch {
    return null;
  }
}

/**
 * POST /api/repos/import
 *
 * This endpoint handles the initiation of a repository import.
 * It is protected by the authentication middleware.
 */
router.post(
  "/import",
  authMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      // 1. Validate the request body.
      const validationResult = importRepoSchema.safeParse(req.body);
      if (!validationResult.success) {
        return next(new AppError(400, "Invalid repoUrl provided."));
      }
      const { repoUrl } = validationResult.data;

      // 2. Get the userId from the authenticated request.
      const { user } = req;
      if (!user) {
        return next(new AppError(401, "User not authenticated."));
      }

      const gitInfo = parseGithubUrl(repoUrl);
      if (!gitInfo) return next(new AppError(400, "Invalid GitHub URL"));

      // 1. Fetch Metadata with Token Authorization
      const githubRes = await axios.get(
        `https://api.github.com/repos/${gitInfo.owner}/${gitInfo.repo}`,
        {
          headers: {
            "User-Agent": "UnderstandX-App",
            Authorization: `token ${env.GITHUB_TOKEN}`, // Increased rate limit
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const githubMetadata = githubRes.data;

      console.log("githubMetadata is ", githubMetadata);

      // 2. Create the record with full metadata
      const newRepo = await prisma.repository.create({
        data: {
          userId: user!.id,
          url: repoUrl,
          name: githubMetadata.name,
          owner: githubMetadata.owner.login,
          avatarUrl: githubMetadata.owner.avatar_url,
          githubId: githubMetadata.id,
          status: RepositoryStatus.PENDING,
        },
      });

      console.log("newRepo is ", newRepo);

      // 3. Queue the worker job
      await repositoryImportQueue.add(QUEUES.REPO_IMPORT, {
        repoId: newRepo.id,
        repoUrl,
      });

      // 4. Return a success response with the repoId.
      return sendSuccess<ImportRepoResponse>(
        res,
        { repoId: newRepo.id },
        "Repository import initiated successfully.",
        202
      );
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * GET /api/repos/:id/logs
 * Fetches historical logs for a specific repository.
 * Used for "hydrating" the UI before the Socket.io stream takes over.
 */
router.get(
  "/:id/logs",
  authMiddleware,
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const { id: repoId } = req.params;
      const { user } = req;
      if (!user) {
        return next(new AppError(401, "User not authenticated."));
      }

      // 1. Security check: Ensure the user owns this repository
      const repository = await prisma.repository.findFirst({
        where: {
          id: repoId,
          userId: user.id,
        },
      });

      if (!repository) {
        return next(new AppError(404, "Repository not found or access denied"));
      }

      // 2. Fetch all logs for this repo ordered by creation time
      const logs = await prisma.log.findMany({
        where: { repositoryId: repoId },
        orderBy: { createdAt: "asc" },
      });

      // 3. Send standardized success response
      const formattedLogs: LogResponse[] = logs.map((log) => ({
        ...log,
        createdAt: log.createdAt.toISOString(),
      }));

      return sendSuccess<LogResponse[]>(
        res,
        formattedLogs,
        "Logs retrieved successfully"
      );
    } catch (error) {
      next(error);
    }
  }
);

export default router;
