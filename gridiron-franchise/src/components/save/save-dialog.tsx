"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotNumber: number;
  onConfirm: (name: string) => void;
  isLoading?: boolean;
}

export function SaveDialog({
  open,
  onOpenChange,
  slotNumber,
  onConfirm,
  isLoading,
}: SaveDialogProps) {
  const [name, setName] = useState(`Save ${slotNumber}`);

  const handleConfirm = () => {
    onConfirm(name || `Save ${slotNumber}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save to Slot {slotNumber}</DialogTitle>
          <DialogDescription>
            This will save your current game progress to the cloud.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="save-name">Save Name</Label>
            <Input
              id="save-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for this save"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Game"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
