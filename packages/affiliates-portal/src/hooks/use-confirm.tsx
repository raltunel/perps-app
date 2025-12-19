"use client";

import { useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    description: "",
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback(
    (opts: ConfirmOptions): Promise<boolean> => {
      setOptions(opts);
      setIsOpen(true);

      return new Promise((resolve) => {
        setResolver(() => resolve);
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (resolver) {
      resolver(true);
      setResolver(null);
    }
    setIsOpen(false);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    if (resolver) {
      resolver(false);
      setResolver(null);
    }
    setIsOpen(false);
  }, [resolver]);

  const ConfirmationDialog = useCallback(
    () => (
      <ConfirmDialog
        open={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={options.title}
        description={options.description}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
      />
    ),
    [isOpen, handleCancel, handleConfirm, options]
  );

  return { confirm, ConfirmationDialog };
}
