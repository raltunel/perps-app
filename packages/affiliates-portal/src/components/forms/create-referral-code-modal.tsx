"use client";

import { GlassModal } from "@/components/common/glass-modal";
import { CreateReferralCodeForm } from "./create-referral-code-form";

interface CreateReferralCodeModalProps {
  open: boolean;
  onClose: () => void;
  commissionRate?: number;
}

export function CreateReferralCodeModal({ open, onClose, commissionRate }: CreateReferralCodeModalProps) {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <GlassModal open={open} onClose={onClose} title="Create New Referral Code">
      <CreateReferralCodeForm onSuccess={handleSuccess} onCancel={onClose} commissionRate={commissionRate} />
    </GlassModal>
  );
}
