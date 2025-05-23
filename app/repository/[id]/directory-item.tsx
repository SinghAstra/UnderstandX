import { DirectoryWithRelations } from "@/interfaces/github";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";
import React, { useState } from "react";
import FileItem from "./file-item";

const DirectoryItem = React.memo(
  ({
    directory,
    level = 0,
    selectedFilePath,
    handleFileSelect,
  }: {
    directory: DirectoryWithRelations;
    selectedFilePath: string | null;
    level: number;
    handleFileSelect: (filePath: string) => void;
  }) => {
    const isSelectedFileInThisDirectory = selectedFilePath?.includes(
      directory.path
    );
    const [isOpen, setIsOpen] = useState(isSelectedFileInThisDirectory);
    const toggleOpen = () => setIsOpen(!isOpen);

    return (
      <div>
        <div
          className=" relative flex items-center py-1 px-2 hover:bg-secondary cursor-pointer text-md transition-colors duration-150 "
          onClick={toggleOpen}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <span className="mr-1 text-muted-foreground">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          {isOpen ? (
            <FolderOpen size={16} className="text-stats-blue mr-2" />
          ) : (
            <Folder size={16} className="text-muted-foreground mr-2" />
          )}
          <span className="font-normal tracking-wider">
            {directory.path.split("/").pop()}
          </span>
        </div>

        {isOpen && (
          <div className="mt-1">
            {/* Display subdirectories */}
            {directory.children?.map((child) => (
              <DirectoryItem
                key={child.id}
                directory={child}
                level={level + 1}
                handleFileSelect={handleFileSelect}
                selectedFilePath={selectedFilePath}
              />
            ))}

            {/* Display files in this directory */}
            {directory.files?.map((file) => (
              <div
                key={file.id}
                style={{ paddingLeft: `${level * 16 + 24}px` }}
              >
                <FileItem
                  file={file}
                  handleFileSelect={handleFileSelect}
                  selectedFilePath={selectedFilePath}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DirectoryItem.displayName = "Directory Item";

export default DirectoryItem;
