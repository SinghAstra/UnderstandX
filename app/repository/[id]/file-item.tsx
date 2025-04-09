import { File } from "@prisma/client";
import { FileText } from "lucide-react";
import React from "react";

const FileItem = React.memo(
  ({
    file,
    handleFileSelect,
    selectedFilePath,
  }: {
    file: File;
    handleFileSelect: (file: string) => void;
    selectedFilePath: string | null;
  }) => {
    const isThisFileTheSelectedFile = file.path === selectedFilePath;
    return (
      <div
        className={`flex items-center justify-between py-1 px-2 hover:bg-secondary cursor-pointer text-md transition-colors duration-150 border-b border-dotted ${
          isThisFileTheSelectedFile && "bg-secondary"
        }`}
        onClick={() => {
          if (!isThisFileTheSelectedFile) {
            handleFileSelect(file.path);
          }
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText size={16} className="text-muted-foreground mr-[2px] " />
          <span className="font-light tracking-wider  truncate max-w-[calc(100%-24px)]">
            {file.name}
          </span>
        </div>
      </div>
    );
  }
);

FileItem.displayName = "File Item";

export default FileItem;
