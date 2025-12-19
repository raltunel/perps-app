"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQueryClient } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { useCommissionSplit } from "@/hooks/use-commission-split";

interface CreateReferralCodeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  commissionRate?: number;
}

export function CreateReferralCodeForm({
  onSuccess,
  onCancel,
  commissionRate,
}: CreateReferralCodeFormProps) {
  const { publicKey, signMessage } = useWallet();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    sliderValue,
    setSliderValue,
    hasValidCommissionRate,
    inviteePercentage,
    youAmount,
    inviteeAmount,
    sliderStep,
  } = useCommissionSplit({ commissionRate });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code) {
      toast.error("Please enter a referral code");
      return;
    }

    if (code.length < 5 || code.length > 12) {
      toast.error("Code must be between 5-12 characters");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(code)) {
      toast.error("Code can only contain lowercase letters, numbers, and dashes");
      return;
    }

    if (!publicKey || !signMessage) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if code is available before proceeding
      const isCodeFree = await Fuul.isAffiliateCodeFree(code);
      if (!isCodeFree) {
        toast.error("This code is already taken. Please choose a different one.");
        setIsSubmitting(false);
        return;
      }

      const message = `I confirm that I am creating the ${code} code on Fuul`;
      const encodedMessage = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(encodedMessage);
      const signature = Buffer.from(signatureBytes).toString("base64");

      await Fuul.createAffiliateCode({
        userIdentifier: publicKey.toBase58(),
        identifierType: UserIdentifierType.SolanaAddress,
        code,
        signature,
        ...(hasValidCommissionRate && { userRebateRate: inviteeAmount / 100 }),
      });

      await queryClient.invalidateQueries();

      toast.success(`Referral code "${code}" created successfully!`);
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create referral code";
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
            Set split commission ratio {hasValidCommissionRate ? `(Your commission level is ${commissionRate}%)` : ''}
          </Label>
          <p className="mt-1 text-xs text-text-muted">
            The commission ratio can be edited once it has been saved.
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

      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-medium text-text-primary">
          Custom Referral Code
        </Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value.toLowerCase())}
          placeholder="Enter 5-12 characters"
          maxLength={12}
          className="border-border-default bg-surface text-white placeholder:text-text-subtle"
        />
        <p className="text-xs text-text-muted">
          Code can be lowercase letters, numbers, or dashes.
        </p>
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
          disabled={isSubmitting}
          className="flex-1 cursor-pointer border-0 bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </form>
  );
}
