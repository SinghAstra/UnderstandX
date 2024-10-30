"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const GetStarted = () => {
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isAuthenticating = status === "loading";

  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/new");
    } else if (!isAuthenticated && !isAuthenticating) {
      router.push("/auth/sign-in");
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isAuthenticating}
      className="cursor-pointer lg"
    >
      Get Started
    </Button>
  );
};

export default GetStarted;
