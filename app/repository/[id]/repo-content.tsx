"use client";
import {
  FileWithParsedAnalysisAndCode,
  RepositoryWithRelationsAndOverview,
} from "@/interfaces/github";
import DirectoryItem from "./directory-item";
import FileItem from "./file-item";

const RepoContent = ({
  repository,
  selectedFile,
  handleFileSelect,
}: {
  repository: RepositoryWithRelationsAndOverview;
  selectedFile: FileWithParsedAnalysisAndCode | null;
  handleFileSelect: (file: FileWithParsedAnalysisAndCode) => void;
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
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        ))}
        {/* Root level files */}
        {repository.files
          ?.filter((file) => !file.directoryId)
          .map((file) => {
            return (
              <FileItem
                selectedFile={selectedFile}
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
