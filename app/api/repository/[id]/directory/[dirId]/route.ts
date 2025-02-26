import { prisma } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: { dirId: string } }
) {
  const { dirId } = props.params;

  try {
    const directory = await prisma.directory.findUnique({
      where: { id: dirId },
      include: {
        children: true,
        files: true,
      },
    });

    if (!directory) {
      return NextResponse.json(
        { message: "Directory not found" },
        { status: 404 }
      );
    }

    const filesMetaData = directory.files.map((file) => {
      return {
        id: file.id,
        path: file.path,
        name: file.name,
      };
    });

    return NextResponse.json({
      directory: { ...directory, files: filesMetaData },
    });
  } catch (error) {
    console.error("Error fetching directory:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
