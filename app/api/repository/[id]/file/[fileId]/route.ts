import { prisma } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  props: { params: { id: string; fileId: string } }
) {
  const { id, fileId } = props.params;

  const file = await prisma.file.findFirst({
    where: { id: fileId, repositoryId: id },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ file });
}
