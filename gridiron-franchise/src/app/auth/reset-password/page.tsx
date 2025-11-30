"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/validations/auth";
import { updatePassword } from "@/lib/supabase/auth";
import { PasswordStrength } from "@/components/auth/password-strength";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch("password", "");

  async function onSubmit(data: ResetPasswordFormData) {
    setIsLoading(true);
    setError(null);

    const result = await updatePassword(data.password);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);

    // Redirect to auth page after short delay
    setTimeout(() => {
      router.push("/auth");
    }, 2000);
  }

  if (success) {
    return (
      <div className="space-y-8">
        {/* Success State */}
        <div className="text-center -mt-4 mb-6">
          <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Password Reset!</h1>
          <p className="text-muted-foreground mt-2">
            Your password has been updated successfully.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Redirecting to sign in...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Override */}
      <div className="text-center -mt-4 mb-6">
        <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <span className="text-4xl">🔑</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">New Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Global Error */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-muted-foreground">
            New Password
          </Label>
          <Input
            id="password"
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
            Confirm New Password
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
          {isLoading ? "Updating..." : "Update Password"}
        </Button>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link href="/auth" className="text-sm text-primary hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
