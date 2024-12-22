import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/utils/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Input validation schema
const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["PENDING", "SUCCESS"]).optional(),
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
    // console.log("url is ", url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    console.log("queryParams is ", queryParams);
    console.log("session.user.id is ", session.user.id);

    // Validate query parameters
    const { page, limit, status } = QuerySchema.parse(queryParams);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query filters
    const where = {
      userId: session.user.id,
      ...(status && { status }),
    };
    console.log("where is ", where);

    // const repositories = await prisma.repository.findMany({
    //   where,
    // orderBy: {
    //   createdAt: "desc",
    // },
    // skip,
    // take: limit,
    // });

    const repositories = await prisma.repository.findMany({});
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
    console.log("Repository list error.");
    // console.log("error is ", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
