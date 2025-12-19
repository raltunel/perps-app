"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Fuul, UserIdentifierType } from "@fuul/sdk";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useCommissionSplit } from "@/hooks/use-commission-split";

interface EditCommissionSplitFormProps {
  code: string;
  currentSplit: number;
  onSuccess: () => void;
  onCancel: () => void;
  commissionRate?: number;
}

export function EditCommissionSplitForm({
  code,
  currentSplit,
  onSuccess,
  onCancel,
  commissionRate,
}: EditCommissionSplitFormProps) {
  const { publicKey, signMessage } = useWallet();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    sliderValue,
    setSliderValue,
    hasValidCommissionRate,
    inviteePercentage,
    youAmount,
    inviteeAmount,
    sliderStep,
  } = useCommissionSplit({
    commissionRate,
    initialSliderValue: 100 - currentSplit,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey || !signMessage) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);

    try {
      const message = `I confirm that I am updating my code to ${code.toLowerCase()} on Fuul`;
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = Buffer.from(signatureBytes).toString("base64");

      await Fuul.updateAffiliateCode({
        userIdentifier: publicKey.toBase58(),
        identifierType: UserIdentifierType.SolanaAddress,
        code: code.toLowerCase(),
        signature,
        userRebateRate: inviteeAmount / 100,
      });

      await queryClient.invalidateQueries();

      toast.success(`Commission split updated successfully!`);
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update commission split";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-text-primary">
            Edit split commission ratio for <span className="font-mono">{code}</span>
          </Label>
          <p className="mt-1 text-xs text-text-muted">
            {hasValidCommissionRate ? `Your commission level is ${commissionRate}%` : 'Commission level not available'}
          </p>
        </div>

        <div className="space-y-4">
          <Slider
            value={[sliderValue]}
            onValueChange={(value) => setSliderValue(value[0])}
            min={50}
            max={100}
            step={sliderStep}
            className="w-full"
            disabled={!hasValidCommissionRate}
          />
          <div className="flex justify-between text-sm">
            <span className="text-text-primary">You {hasValidCommissionRate ? `${youAmount.toFixed(1)}%` : '-'}</span>
            <span className="text-text-primary">Invitee {hasValidCommissionRate ? `${inviteeAmount.toFixed(1)}%` : '-'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="flex-1 cursor-pointer border-border-default bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !hasValidCommissionRate}
          className="flex-1 cursor-pointer border-0 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </form>
  );
}
