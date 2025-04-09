"use client";
import { RepositoryWithRelationsAndOverview } from "@/interfaces/github";
import DirectoryItem from "./directory-item";
import FileItem from "./file-item";

const RepoContent = ({
  repository,
  selectedFilePath,
  handleFileSelect,
}: {
  repository: RepositoryWithRelationsAndOverview;
  selectedFilePath: string | null;
  handleFileSelect: (filePath: string) => void;
}) => {
  return (
    <div className="border-r border-border border-dotted fixed inset-y-0 left-0 w-96 mt-20 overflow-auto">
      <div className="p-3 ">
        {/* Root directories */}
        {repository.directories?.map((directory) => (
          <DirectoryItem
            level={0}
            key={directory.id}
            directory={directory}
            selectedFilePath={selectedFilePath}
            handleFileSelect={handleFileSelect}
          />
        ))}
        {/* Root level files */}
        {repository.rootFiles
          ?.filter((file) => !file.directoryId)
          .map((file) => {
            return (
              <FileItem
                selectedFilePath={selectedFilePath}
                key={file.id}
                file={file}
                handleFileSelect={handleFileSelect}
              />
            );
          })}
      </div>
    </div>
  );
};

export default RepoContent;
