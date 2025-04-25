"use server";
// import { authOptions } from "@/lib/auth-options";
// import { prisma } from "@/lib/prisma";
// import { getServerSession } from "next-auth";

// export async function getRepository(repositoryId: string) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return { message: "Authentication required" };
//     }

//     const repository = await prisma.repository.findUnique({
//       where: { id: repositoryId, userId: session.user.id },
//     });

//     return { repository };
//   } catch (error) {
//     if (error instanceof Error) {
//       console.log("error.stack is ", error.stack);
//       console.log("error.message is ", error.message);
//     }
//     return { message: "Failed to fetch repository details." };
//   }
// }
