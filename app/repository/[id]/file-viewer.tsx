import { prisma } from "@/lib/utils/prisma";
import { FileViewerClient } from "./file-viewer-client";

export async function getFileById(fileId: string) {
  return await prisma.file.findUnique({
    where: { id: fileId },
  });
}

interface FileViewerProps {
  fileId: string;
}

export default async function FileViewer({ fileId }: FileViewerProps) {
  const file = await getFileById(fileId);

  if (!file) return <div className="ml-96 w-full p-3">File not found</div>;

  return <FileViewerClient file={file} />;
}
