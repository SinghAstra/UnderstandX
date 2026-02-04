"use client";

import { CustomInput } from "@/components/reusable/custom-input";
import { PasswordStrengthCheck } from "@/components/reusable/password-strength-check";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { logError } from "@/lib/log-error";
import { ROUTES } from "@/lib/routes";
import { GoogleLogo } from "@/lib/svg";
import { type SignUpFormValues, signUpSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader, Lock, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AuthNavbar from "../../components/auth-navbar";

function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });
  const [mailSent, setMailSent] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const passwordValue = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    const performSignUp = async () => {
      // 1. Post data to the dedicated register endpoint using Fetch
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // 2. Parse the JSON response
      const responseData = await response.json();
      const message = responseData?.message || "An unknown error occurred.";

      if (!response.ok) {
        // 3. Manual Error Handling
        throw new Error(message);
      }

      // 4. Successful registration flow
      setMailSent(true);
      // The successful 'message' from the API will be returned
      return message;
    };

    const promise = performSignUp();

    toast.promise(promise, {
      loading: "Creating your account...",
      success: (message) => `${message}`,
      error: (err) => `${err.message}`,
    });

    await promise;
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", {
        redirect: true,
      });
    } catch (error) {
      logError(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4 bg-muted/30 max-w-lg w-full h-screen overflow-y-auto">
      <AuthNavbar />

      <div className="flex flex-col gap-8 sm:px-8 my-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
            Get started
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create a new account
          </p>
        </div>

        <Button
          className="w-full rounded-lg tracking-wide relative cursor-pointer transition-all duration-300 ease-in-out active:scale-[0.98] py-2 px-3"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <>
              <Loader className="size-4 animate-spin" />
              Wait ...
            </>
          ) : (
            <>
              <GoogleLogo className="mr-2" />
              <span className="text-center tracking-wide">
                Continue with Google
              </span>
            </>
          )}
        </Button>

        <div className="relative flex gap-4 items-center">
          <span className="flex-1 flex items-center">
            <Separator />
          </span>
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            Or
          </span>
          <span className="flex-1 flex items-center">
            <Separator />
          </span>
        </div>

        {mailSent ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-600">
            <div className="bg-card border border-border rounded-lg p-6 flex gap-4 items-start shadow-sm hover:shadow-md hover:border-foreground/20 transition-all duration-300 ease-in-out">
              <div className="bg-primary/10 p-2 rounded-md shrink-0">
                <Check className="size-4 text-primary" strokeWidth={2} />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground tracking-tight">
                  Check your email to confirm
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We&apos;ve sent a confirmation link to{" "}
                  <strong className="font-medium">{watch("email")}</strong>.
                  Please check your inbox to confirm your account before signing
                  in. The confirmation link expires in 10 minutes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <CustomInput
              label="Email"
              id="email"
              type="email"
              placeholder="attorney@firm.com"
              required
              PrefixIcon={Mail}
              {...register("email")}
              error={errors.email?.message}
            />

            <div className="space-y-2">
              <CustomInput
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                PrefixIcon={Lock}
                isPassword={true}
                {...register("password")}
                onFocus={() => setShowPasswordStrength(true)}
                error={errors.password?.message}
              />

              {showPasswordStrength && (
                <PasswordStrengthCheck password={passwordValue} />
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90 font-medium transition-all duration-300 ease-in-out rounded-lg active:scale-[0.98] py-2 px-3"
            >
              {isSubmitting ? (
                <>
                  <Loader
                    className="size-4 animate-spin mr-2"
                    strokeWidth={2}
                  />
                  Wait ...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        )}

        <p className="text-muted-foreground text-sm text-center leading-relaxed">
          Have an account?{" "}
          <Link
            href={ROUTES.AUTH.SIGN_IN}
            className="border-b border-foreground hover:border-foreground/50 text-foreground hover:text-foreground/70 transition-all duration-300 ease-in-out font-medium"
          >
            Sign In Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
