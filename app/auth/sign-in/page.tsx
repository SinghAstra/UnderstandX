import SignInForm from "@/components/auth/sign-in-form";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-start max-w-sm mx-auto min-h-screen overflow-hidden pt-4">
      <Link
        href="/"
        className="flex items-center gap-x-2 py-8 w-full border-b border-border/80"
      >
        <Image
          src={"/images/favicon.ico"}
          alt={`${siteConfig.name} logo`}
          width={30}
          height={30}
          className="rounded"
          priority
        />
        <h1 className="text-lg font-medium">{siteConfig.name}</h1>
      </Link>

      <SignInForm />

      <div className="flex justify-end mt-auto border-t border-border/80 py-6 w-full">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
