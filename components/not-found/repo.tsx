"use client";

import { FileQuestion } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function NotFound() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main className="flex mx-auto mt-16 flex-col items-center justify-center relative">
      <div className="text-center space-y-6 backdrop-blur-sm rounded-md bg-card/50 border py-4 px-2 relative ">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

        <div className="mb-6 p-3 rounded-full bg-secondary inline-block animate-bounce">
          <FileQuestion className="w-12 h-12 text-gray-400  " />
        </div>

        <h1 className="text-4xl">Repository Not Found</h1>

        <p className="text-muted-foreground max-w-[450px] mx-auto">
          We couldn&apos;t find the repository you&apos;re looking for. It might
          have been moved or deleted.
        </p>

        <Button
          onClick={() => router.push(session ? "/dashboard" : "/")}
          variant="outline"
        >
          {session ? "Back to Dashboard" : "Return Home"}
        </Button>
      </div>
    </main>
  );
}
