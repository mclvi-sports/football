"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SaveSlots } from "@/components/save/save-slots";

export default function LoadCareerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[500px] mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Load Career</h1>
        </div>

        {/* Save Slots */}
        <SaveSlots />
      </div>
    </div>
  );
}
