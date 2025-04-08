"use client";
import { RepositoryWithRelations } from "@/interfaces/github";
import { useRouter } from "next/navigation";
import DirectoryItem from "./directory-item";
import FileItem from "./file-item";

const RepoContent = ({
  repository,
  selectedFileId,
}: {
  repository: RepositoryWithRelations;
  selectedFileId?: string;
}) => {
  const router = useRouter();

  const handleFileSelect = (fileId: string) => {
    router.push(`?fileId=${fileId}`);
  };

  // const clearSelectedFile = () => {
  //   router.push(".");
  // };

  return (
    <div className="border-r border-border border-dotted fixed inset-y-0 left-0 w-96 mt-20 overflow-auto">
      <div className="p-3 ">
        {/* Root directories */}
        {repository.directories?.map((directory) => (
          <DirectoryItem
            level={0}
            key={directory.id}
            directory={directory}
            selectedFileId={selectedFileId}
            onFileSelect={handleFileSelect}
          />
        ))}
        {/* Root level files */}
        {repository.files
          ?.filter((file) => !file.directoryId)
          .map((file) => {
            return (
              <FileItem
                selectedFileId={selectedFileId}
                key={file.id}
                file={file}
                onFileSelect={handleFileSelect}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RepoContent;
