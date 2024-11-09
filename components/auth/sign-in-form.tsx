"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import APP_PATHS from "@/config/path.config";
import {
  SignInSchema,
  SignInSchemaType,
} from "@/lib/validators/auth.validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "../password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const SignInForm = () => {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSignIn(data: SignInSchemaType) {
    console.log("In handleSignIn data is ", data);
  }

  return (
    <div className="flex flex-col items-start gap-y-6 py-8 w-full px-0.5 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="space-y-6 w-full p-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="name@gmail.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput field={field} placeholder="Password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link
              href={APP_PATHS.FORGOT_PASSWORD}
              className="text-xs text-muted-foreground font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full mt-6"
            aria-label="submit"
          >
            {form.formState.isSubmitting ? "Please wait..." : "Sign In"}
          </Button>
          {/* <DemarcationLine />
          <GoogleOauthButton label="Sign in with Google" /> */}
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
