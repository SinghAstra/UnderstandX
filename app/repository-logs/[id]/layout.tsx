import { Navbar } from "@/components/repo-logs/navbar";

interface RepositoryLogsLayoutProps {
  children: React.ReactNode;
}

export default async function RepositoryLogsLayout({
  children,
}: RepositoryLogsLayoutProps) {
  return (
    <>
      <div className="flex flex-col ">
        <Navbar />
        {children}
      </div>
    </>
  );
}
