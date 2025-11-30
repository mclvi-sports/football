"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";

type AuthTab = "signin" | "signup";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex bg-muted rounded-xl p-1">
        <button
          type="button"
          onClick={() => setActiveTab("signin")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors",
            activeTab === "signin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("signup")}
          className={cn(
            "flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-colors",
            activeTab === "signup"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign Up
        </button>
      </div>

      {/* Form Content */}
      {activeTab === "signin" ? <SignInForm /> : <SignUpForm />}
    </div>
  );
}
