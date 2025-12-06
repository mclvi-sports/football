"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { SaveSlotCard } from "./save-slot-card";
import { SaveDialog } from "./save-dialog";
import { LoadDialog } from "./load-dialog";
import { DeleteDialog } from "./delete-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import type { SaveSlot, SaveSlotMetadata } from "@/lib/supabase/types";
import {
  listSaves,
  saveGame,
  loadGame,
  deleteSave,
} from "@/lib/supabase/save-game";

export function SaveSlots() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOperating, setIsOperating] = useState(false);

  // Dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveSlotNumber, setSaveSlotNumber] = useState<number>(1);

  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [loadSaveId, setLoadSaveId] = useState<string>("");
  const [loadSaveName, setLoadSaveName] = useState<string>("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSaveId, setDeleteSaveId] = useState<string>("");
  const [deleteSaveName, setDeleteSaveName] = useState<string>("");

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    const data = await listSaves();
    setSlots(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchSlots();
    }
  }, [authLoading, fetchSlots]);

  const handleSaveClick = (slotNumber: number) => {
    setSaveSlotNumber(slotNumber);
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = async (name: string) => {
    setIsOperating(true);
    const result = await saveGame(saveSlotNumber, name);
    setIsOperating(false);
    setSaveDialogOpen(false);

    if (result.success) {
      fetchSlots();
    } else {
      alert(result.error || "Failed to save game");
    }
  };

  const handleLoadClick = (saveId: string) => {
    const slot = slots.find(
      (s) => !s.isEmpty && s.id === saveId
    ) as SaveSlotMetadata | undefined;
    if (slot) {
      setLoadSaveId(saveId);
      setLoadSaveName(slot.name);
      setLoadDialogOpen(true);
    }
  };

  const handleLoadConfirm = async () => {
    setIsOperating(true);
    const result = await loadGame(loadSaveId);
    setIsOperating(false);
    setLoadDialogOpen(false);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      alert(result.error || "Failed to load game");
    }
  };

  const handleDeleteClick = (saveId: string) => {
    const slot = slots.find(
      (s) => !s.isEmpty && s.id === saveId
    ) as SaveSlotMetadata | undefined;
    if (slot) {
      setDeleteSaveId(saveId);
      setDeleteSaveName(slot.name);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsOperating(true);
    const result = await deleteSave(deleteSaveId);
    setIsOperating(false);
    setDeleteDialogOpen(false);

    if (result.success) {
      fetchSlots();
    } else {
      alert(result.error || "Failed to delete save");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading saves...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-secondary/30 border border-border rounded-xl p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Sign in to save your game progress to the cloud.
        </p>
        <Button onClick={() => router.push("/auth")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
          Cloud Saves
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSlots}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Slots */}
      <div className="space-y-3">
        {slots.map((slot) => (
          <SaveSlotCard
            key={slot.slotNumber}
            slot={slot}
            onSave={handleSaveClick}
            onLoad={handleLoadClick}
            onDelete={handleDeleteClick}
            isLoading={isOperating}
          />
        ))}
      </div>

      {/* Save Dialog */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        slotNumber={saveSlotNumber}
        onConfirm={handleSaveConfirm}
        isLoading={isOperating}
      />

      {/* Load Dialog */}
      <LoadDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        saveName={loadSaveName}
        onConfirm={handleLoadConfirm}
        isLoading={isOperating}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        saveName={deleteSaveName}
        onConfirm={handleDeleteConfirm}
        isLoading={isOperating}
      />
    </div>
  );
}
