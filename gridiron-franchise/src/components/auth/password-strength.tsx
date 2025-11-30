"use client";

import { getPasswordStrength } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  // Calculate how many bars to fill (out of 4)
  const filledBars = Math.min(Math.ceil(score / 1.5), 4);

  return (
    <div className="space-y-2 mt-2">
      {/* Strength Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              bar <= filledBars ? color : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* Strength Label */}
      <p className="text-xs text-muted-foreground">
        {label && (
          <>
            <span
              className={cn(
                "font-medium",
                score <= 2 && "text-red-500",
                score > 2 && score <= 4 && "text-yellow-500",
                score > 4 && "text-green-500"
              )}
            >
              {label}
            </span>
            {score <= 4 && (
              <span> - Add special characters for stronger password</span>
            )}
          </>
        )}
      </p>
    </div>
  );
}
