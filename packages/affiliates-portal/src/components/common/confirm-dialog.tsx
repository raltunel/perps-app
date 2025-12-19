"use client";

import { GlassModal } from "./glass-modal";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <GlassModal open={open} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-text-secondary text-sm">{description}</p>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-surface border-border-default text-text-secondary hover:bg-surface-hover hover:text-text-primary cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-red-500/80 hover:bg-red-500 text-white border-0 cursor-pointer"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </GlassModal>
  );
}
