"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="space-y-8">
      {/* Header Override */}
      <div className="text-center -mt-4 mb-6">
        <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <span className="text-4xl">✉️</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground mt-2">
          We sent a password reset link
        </p>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <p className="text-center text-muted-foreground">
          We sent a reset link to
          <br />
          <strong className="text-foreground">{email}</strong>
        </p>

        {/* Open Email Button */}
        <Button asChild className="w-full">
          <a href="mailto:" target="_blank" rel="noopener noreferrer">
            Open Email App
          </a>
        </Button>

        {/* Resend Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-primary hover:underline"
            >
              Resend
            </Link>
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link href="/auth" className="text-sm text-primary hover:underline">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <CheckEmailContent />
    </Suspense>
  );
}
