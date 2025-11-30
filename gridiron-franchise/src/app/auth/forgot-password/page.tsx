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
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { resetPasswordForEmail } from "@/lib/supabase/auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true);
    setError(null);

    const result = await resetPasswordForEmail(data.email);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    // Redirect to check email page with email as query param
    router.push(`/auth/check-email?email=${encodeURIComponent(data.email)}`);
  }

  return (
    <div className="space-y-8">
      {/* Header Override */}
      <div className="text-center -mt-4 mb-6">
        <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <span className="text-4xl">🔐</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          We&apos;ll send you a reset link
        </p>
      </div>

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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            href="/auth"
            className="text-sm text-primary hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
