import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import React, { useState } from "react";

const RepoProcessedBackground = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  // Mock repository structure with files and directories
  const mockRepo = {
    name: "awesome-project",
    description: "A really cool project",
    directories: [
      {
        id: "dir1",
        name: "src",
        isOpen: true,
        files: [
          { id: "file1", name: "index.js" },
          { id: "file2", name: "app.js" },
        ],
        subdirectories: [
          {
            id: "subdir1",
            name: "components",
            isOpen: true,
            files: [
              { id: "file3", name: "Button.jsx" },
              { id: "file4", name: "Card.jsx" },
            ],
          },
        ],
      },
      {
        id: "dir2",
        name: "public",
        isOpen: false,
        files: [{ id: "file5", name: "index.html" }],
      },
    ],
  };

  return (
    <div className="absolute top-8 left-8 w-full flex flex-col overflow-hidden">
      <div className="p-2 rounded-md border">
        {mockRepo.directories.map((dir, idx) => (
          <div key={dir.id} className="mb-1">
            <div className="flex items-center py-1 px-1 hover:bg-secondary cursor-pointer text-sm">
              <span className="mr-1 text-muted-foreground">
                {dir.isOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </span>
              {dir.isOpen ? (
                <FolderOpen size={14} className="text-stats-blue mr-1" />
              ) : (
                <Folder size={14} className="text-muted-foreground mr-1" />
              )}
              <span className="truncate font-normal">{dir.name}</span>
            </div>

            {dir.isOpen && (
              <div className="ml-4">
                {dir.files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center py-1 px-1 hover:bg-secondary cursor-pointer text-sm ${
                      selectedIndex === idx ? "bg-secondary/50" : ""
                    }`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    <FileText
                      size={14}
                      className="text-muted-foreground mr-1"
                    />
                    <span className="truncate font-light">{file.name}</span>
                  </div>
                ))}

                {dir.subdirectories?.map((subdir) => (
                  <div key={subdir.id} className="mb-1">
                    <div className="flex items-center py-1 px-1 hover:bg-secondary cursor-pointer text-sm">
                      <span className="mr-1 text-muted-foreground">
                        {subdir.isOpen ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </span>
                      {subdir.isOpen ? (
                        <FolderOpen
                          size={14}
                          className="text-stats-blue mr-1"
                        />
                      ) : (
                        <Folder
                          size={14}
                          className="text-muted-foreground mr-1"
                        />
                      )}
                      <span className="truncate font-normal">
                        {subdir.name}
                      </span>
                    </div>

                    {subdir.isOpen && (
                      <div className="ml-4">
                        {subdir.files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center py-1 px-1 hover:bg-secondary cursor-pointer text-sm"
                          >
                            <FileText
                              size={14}
                              className="text-muted-foreground mr-1"
                            />
                            <span className="truncate font-light">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepoProcessedBackground;
