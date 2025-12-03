"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCareerStore } from "@/stores/career-store";

export default function NewCareerPage() {
  const router = useRouter();
  const { reset } = useCareerStore();

  useEffect(() => {
    // Reset career state when starting fresh
    reset();
    // Redirect to league generation (Owner model flow)
    router.replace("/career/new/generate");
  }, [router, reset]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-40px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
