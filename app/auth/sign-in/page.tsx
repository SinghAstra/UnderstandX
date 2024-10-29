"use client";
import { VerticalAnimationContainer } from "@/components/global/animation-container";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
  const session = useSession();
  const router = useRouter();
  const isAuthenticated = session.status === "authenticated";
  const isAuthenticating = session.status === "loading";

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/projects");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-start max-w-sm mx-auto min-h-screen overflow-hidden pt-4">
      <VerticalAnimationContainer
        reverse
        delay={0.1}
        className="flex items-center w-full py-8 border-b border-border/80"
      >
        <Link href="/" className="flex items-center gap-x-2">
          <Icons.logo className="w-6 h-6" />
          <h1 className="text-lg font-medium">{siteConfig.name}</h1>
        </Link>
      </VerticalAnimationContainer>

      <VerticalAnimationContainer delay={0.2}>
        <div className="flex mt-16 mb-8 items-center justify-center flex-col gap-2 w-full">
          {isAuthenticating ? (
            <Card className="w-full max-w-md mx-auto ">
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-4 text-lg font-medium text-gray-300">
                  {isAuthenticating ? "Authenticating..." : "Redirecting..."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="relative inline-flex h-10 overflow-hidden rounded-full p-[1.5px] w-full"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--primary-foreground))_50%,hsl(var(--primary))_100%)]" />

              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[hsl(var(--background))] px-4 py-1 text-sm font-medium text-[hsl(var(--foreground))] backdrop-blur-3xl">
                Connect Github
                <Icons.next className="ml-2 size-6 animate-moveLeftRight" />
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-col items-start w-full">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary">
              Terms of Service{" "}
            </Link>
            and{" "}
            <Link href="/privacy" className="text-primary">
              Privacy Policy
            </Link>
          </p>
        </div>
      </VerticalAnimationContainer>
    </div>
  );
};

export default SignInPage;
