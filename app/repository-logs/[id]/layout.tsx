import { Navbar } from "@/components/home/home-navbar";

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
