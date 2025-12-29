import { QUEUES } from "@/constants/queues";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middleware/auth.middleware";
import { repositoryImportQueue } from "@/queue";
import { AppError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";
import { prisma, RepositoryStatus } from "@understand-x/database";
import { ImportRepoResponse, importRepoSchema } from "@understand-x/shared";
import { Router } from "express";

const router = Router();

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

      // 3. Create a new Repository record in the database with PENDING status.
      const newRepo = await prisma.repository.create({
        data: {
          userId: user.id,
          url: repoUrl,
          status: RepositoryStatus.PENDING,
        },
      });

      console.log("newRepo is ", newRepo);
      const repoId = newRepo.id;

      // 4. Add a job to the repository import queue.
      // The worker will use this repoId to update the repository's status and details.
      await repositoryImportQueue.add(QUEUES.REPO_IMPORT, {
        repoId,
        userId: user.id,
        repoUrl,
      });

      // 5. Return a success response with the repoId.
      return sendSuccess<ImportRepoResponse>(
        res,
        { repoId },
        "Repository import initiated successfully.",
        202
      );
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
