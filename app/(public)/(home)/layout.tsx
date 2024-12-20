import { Navbar } from "@/components/layout/navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="absolute inset-0 bg-grid-white "></div>
        <Navbar />
        {children}
      </div>
    </>
  );
}
