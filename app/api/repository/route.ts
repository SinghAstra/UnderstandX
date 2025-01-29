import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { Prisma, RepositoryStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.nativeEnum(RepositoryStatus).optional(),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    console.log("queryParams is ", queryParams);
    console.log("session.user.id is ", session.user.id);

    // Validate query parameters
    const { page, limit, status, search } = QuerySchema.parse(queryParams);

    // Calculate pagination
    const skip = (page - 1) * limit;
    // Build query filters
    const where: Prisma.RepositoryWhereInput = {
      userId: session.user.id,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { owner: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const repositories = await prisma.repository.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    console.log("repositories.length is ", repositories.length);

    const totalCount = await prisma.repository.count({ where });

    console.log("totalCount is ", totalCount);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      repositories,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    console.log("Fetch User All Repository error.");
    if (error instanceof Error) {
      console.log("Error message:", error.message);
      console.log("Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
