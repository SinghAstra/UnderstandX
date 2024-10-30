import Navbar from "@/components/navigation/navbar";
import { GitHubService } from "@/services/githubService";
import React from "react";

export default async function NewChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const githubService = new GitHubService(
    process.env.GITHUB_PUBLIC_ACCESS_TOKEN
  );
  await githubService.fetchFile("https://github.com/SinghAstra/DevAssistX");
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {children}
    </div>
  );
}
