import { Navbar } from "@/components/layout/navbar";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* TODO: Replace this with bg-gradient class */}
        <div className="absolute inset-0 bg-grid-white [mask-image:linear-gradient(0deg,transparent,black)] dark:opacity-20"></div>
        <Navbar />
        {children}
      </div>
    </>
  );
}
