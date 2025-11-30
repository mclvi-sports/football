"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { signUp } from "@/lib/supabase/auth";
import { PasswordStrength } from "./password-strength";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch("password", "");

  async function onSubmit(data: SignUpFormData) {
    setIsLoading(true);
    setError(null);

    const result = await signUp(data.email, data.password);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to home after successful sign up
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
        <Label htmlFor="signup-email" className="text-muted-foreground">
          Email
        </Label>
        <Input
          id="signup-email"
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
        <Label htmlFor="signup-password" className="text-muted-foreground">
          Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("password")}
          className={errors.password ? "border-destructive" : ""}
        />
        <PasswordStrength password={password} />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-muted-foreground">
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}
