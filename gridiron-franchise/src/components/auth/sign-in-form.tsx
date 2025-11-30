"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { signIn } from "@/lib/supabase/auth";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormData) {
    setIsLoading(true);
    setError(null);

    const result = await signIn(data.email, data.password);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Global Error */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          disabled={isLoading}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("password")}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      {/* Guest Mode */}
      <div className="text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Continue as Guest →
        </Link>
      </div>
    </form>
  );
}
