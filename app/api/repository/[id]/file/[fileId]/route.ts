import { prisma } from "@/lib/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string; fileId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const { id, fileId } = await props.params;

  const file = await prisma.file.findFirst({
    where: { id: fileId, repositoryId: id },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return NextResponse.json({ file });
}
