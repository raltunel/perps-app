"use client";

import { GlassModal } from "@/components/common/glass-modal";
import { EditCommissionSplitForm } from "./edit-commission-split-form";

interface EditCommissionSplitModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  currentSplit: number;
  commissionRate?: number;
}

export function EditCommissionSplitModal({
  open,
  onClose,
  code,
  currentSplit,
  commissionRate,
}: EditCommissionSplitModalProps) {
  return (
    <GlassModal open={open} onClose={onClose} title="Edit Commission Split">
      <EditCommissionSplitForm
        code={code}
        currentSplit={currentSplit}
        onSuccess={onClose}
        onCancel={onClose}
        commissionRate={commissionRate}
      />
    </GlassModal>
  );
}
