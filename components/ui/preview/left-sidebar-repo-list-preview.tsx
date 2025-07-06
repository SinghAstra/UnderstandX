"use client";

import { RepositoryPreview } from "@/interfaces/github";
import { containerVariant } from "@/lib/variants";
import { motion } from "framer-motion";
import React from "react";
import { SidebarRepositoryCardPreview } from "./left-sidebar-repository-card-preview";

const LeftSidebarRepoListPreview = ({
  previewRepos,
}: {
  previewRepos: RepositoryPreview[];
}) => {
  return (
    <div className="w-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-[420px] bg-background lg:border-r lg:border-dashed lg:pt-16">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        className="flex flex-col gap-4 h-full px-2 py-3 pl-16 overflow-y-auto "
      >
        {previewRepos.map((repo) => {
          return (
            <SidebarRepositoryCardPreview
              key={repo.avatarUrl}
              repository={repo}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default LeftSidebarRepoListPreview;
