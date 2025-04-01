"use server";
import { prisma } from "@/lib/utils/prisma";

export async function getRepository(repositoryId: string) {
  try {
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId },
    });

    return { repository };
  } catch (error) {
    if (error instanceof Error) {
      console.log("error.stack is ", error.stack);
      console.log("error.message is ", error.message);
    }
    return { message: "Failed to fetch repository details." };
  }
}
