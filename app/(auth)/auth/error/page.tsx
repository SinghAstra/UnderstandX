"use client";
import { Icons } from "@/components/Icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "Configuration":
      return {
        title: "Server Configuration Error",
        description:
          "There is an issue with the server configuration. Please try again later or contact support.",
      };
    case "AccessDenied":
      return {
        title: "Access Denied",
        description:
          "You don't have permission to sign in. Please ensure you're using the correct account.",
      };
    case "Verification":
      return {
        title: "Verification Error",
        description:
          "The verification link may have expired or already been used. Please try signing in again.",
      };
    case "OAuthSignin":
      return {
        title: "GitHub Sign-In Error",
        description:
          "There was a problem signing in with GitHub. Please try again.",
      };
    case "OAuthCallback":
      return {
        title: "GitHub Callback Error",
        description:
          "There was an error processing your GitHub login. Please try again.",
      };
    case "Callback":
      return {
        title: "Authentication Callback Error",
        description:
          "There was an error during the authentication process. Please try again.",
      };
    default:
      return {
        title: "Authentication Error",
        description:
          "An unexpected error occurred during sign in. Please try again.",
      };
  }
};

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { title, description } = getErrorMessage(error);

  return (
    <div className="w-full mt-5">
      <Alert variant="destructive" className="mt-4">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      <div className="mt-8 space-y-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/auth/sign-in">
            <Icons.gitLogo className="mr-2 h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
