import { REPOSITORY_IMPORT_QUEUE } from "@/constants/queues";
import {
  AuthenticatedRequest,
  authMiddleware,
} from "@/middleware/auth.middleware";
import { repositoryImportQueue } from "@/queue";
import { AppError } from "@/utils/AppError";
import { sendSuccess } from "@/utils/response";
import { prisma } from "@understand-x/database";
import { Router } from "express";
import { z } from "zod";

const router = Router();

// Define the schema for the request body to validate the repoUrl.
const importRepoSchema = z.object({
  repoUrl: z.url(),
});

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
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError(401, "User not authenticated."));
      }

      // 3. Create a new Repository record in the database with PENDING status.
      const newRepo = await prisma.repository.create({
        data: {
          userId,
          url: repoUrl,
          status: "PENDING", // Initial status
        },
      });
      const repoId = newRepo.id;

      // 4. Add a job to the repository import queue.
      // The worker will use this repoId to update the repository's status and details.
      await repositoryImportQueue.add(REPOSITORY_IMPORT_QUEUE, {
        repoId,
        userId,
        repoUrl,
      });

      // 5. Return a success response with the repoId.
      return sendSuccess(
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
