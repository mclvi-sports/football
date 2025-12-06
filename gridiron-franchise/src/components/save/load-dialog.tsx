"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saveName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LoadDialog({
  open,
  onOpenChange,
  saveName,
  onConfirm,
  isLoading,
}: LoadDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Load Game</AlertDialogTitle>
          <AlertDialogDescription>
            Load &quot;{saveName}&quot;? This will replace your current game
            progress with the saved data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load Game"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
