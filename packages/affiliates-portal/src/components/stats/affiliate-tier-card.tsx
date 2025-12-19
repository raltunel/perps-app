"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";
import { Copy, Info } from "lucide-react";
import { TwitterIcon } from "@/components/icons/twitter-icon";
import { TelegramIcon } from "@/components/icons/telegram-icon";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  RadixSelect,
  RadixSelectContent,
  RadixSelectItem,
  RadixSelectTrigger,
  RadixSelectValue,
} from "@/components/ui/radix-select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/auth/use-auth";
import { useAffiliateAudience } from "@/lib/api";
import { getCommissionByAudienceId } from "@/lib/constants/affiliate-levels";
import { APP_CONFIG, buildReferralUrl } from "@/lib/constants/app-config";
import { CreateReferralCodeModal } from "@/components/forms/create-referral-code-modal";

export function AffiliateTierCard() {
  const router = useRouter();
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isConnected, walletAddress } = useAuth();
  const { data: audienceData } = useAffiliateAudience(
    walletAddress || "",
    isConnected && !!walletAddress
  );

  // Get affiliate code
  const { data: affiliateData } = useQuery({
    queryKey: ["affiliateCode", walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      return await Fuul.getAffiliateCode(
        walletAddress,
        UserIdentifierType.SolanaAddress
      );
    },
    enabled: isConnected && !!walletAddress,
  });

  const affiliateCode = affiliateData?.code ?? "";
  const userRebateRate = affiliateData?.user_rebate_rate ?? 0;

  useEffect(() => {
    if (affiliateCode && !selectedCode) {
      setSelectedCode(affiliateCode);
    }
  }, [affiliateCode, selectedCode]);

  const handleCodeChange = (code: string) => {
    setSelectedCode(code);
  };

  const affiliateLevel = audienceData?.audiences?.results?.[0]?.name ?? "-";
  const audienceId = audienceData?.audiences?.results?.[0]?.id;
  const levelCommission = audienceId ? getCommissionByAudienceId(audienceId) : 0.2;

  const forInviteeCommission = userRebateRate;
  const forYouCommission = levelCommission !== undefined
    ? levelCommission - userRebateRate
    : undefined;

  const affiliateUrl = buildReferralUrl(selectedCode);

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`${APP_CONFIG.texts.shareMessage} ${affiliateUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  const shareOnTelegram = () => {
    const telegramText = encodeURIComponent(`${APP_CONFIG.texts.shareMessage} ${affiliateUrl}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(affiliateUrl)}&text=${telegramText}`, "_blank");
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleManageReferralCodes = () => {
    router.push("/?view=links");
    setTimeout(() => {
      const linksTitle = document.getElementById("view-links");
      if (linksTitle) {
        const yOffset = -100;
        const y =
          linksTitle.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-3 text-lg font-semibold text-text-primary">
            Affiliate Current Level
          </h3>
          <span className="text-base font-semibold text-text-muted">{affiliateLevel}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManageReferralCodes}
          className="cursor-pointer border border-border-strong bg-surface text-text-muted hover:border-border-strong hover:bg-surface-hover hover:text-text-secondary"
        >
          Manage referral codes
        </Button>
      </div>

      {/* Commission Rates */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-secondary">Level Commission</h4>
            <span className="text-2xl font-bold text-text-primary">
              {levelCommission !== undefined ? `${(levelCommission * 100).toFixed(0)}%` : "-"}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-secondary">Commission Split</h4>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help flex-col items-center">
                    <span className="text-2xl font-bold text-text-primary">
                      {forYouCommission !== undefined ? `${(forYouCommission * 100).toFixed(0)}%` : "-"}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-text-primary">For you</span>
                      <Info className="h-3 w-3 text-text-subtle" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border border-border-default bg-popover text-text-primary"
                >
                  <p>Your commission based on selected code split</p>
                </TooltipContent>
              </Tooltip>

              <span className="text-text-subtle">→</span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help flex-col items-center">
                    <span className="text-2xl font-bold text-text-primary">
                      {forInviteeCommission !== undefined ? `${(forInviteeCommission * 100).toFixed(0)}%` : "-"}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      <span className="text-xs text-text-primary">For invitee</span>
                      <Info className="h-3 w-3 text-text-subtle" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border border-border-default bg-popover text-text-primary"
                >
                  <p>Invitee rebate based on selected code split</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Selector */}
      <div className="mt-auto space-y-3">
        {affiliateCode ? (
          <>
            <div className="flex items-center gap-3 rounded-xl border border-border-default bg-surface p-3">
              <RadixSelect value={selectedCode} onValueChange={handleCodeChange}>
                <RadixSelectTrigger className="flex-1 border-0 bg-transparent text-text-primary shadow-none hover:bg-surface focus:ring-0">
                  <RadixSelectValue placeholder="Select a code" />
                </RadixSelectTrigger>
                <RadixSelectContent>
                  <RadixSelectItem key={affiliateCode} value={affiliateCode}>
                    {affiliateCode}
                  </RadixSelectItem>
                </RadixSelectContent>
              </RadixSelect>
              <button
                onClick={() => copyToClipboard(selectedCode, "Referral code")}
                className="rounded-lg p-2 transition-colors hover:bg-surface-hover"
              >
                <Copy className="h-4 w-4 text-text-muted hover:text-text-primary" />
              </button>
            </div>

            {/* Affiliate URL */}
            <div className="flex items-center gap-3 rounded-xl border border-border-default bg-surface p-3">
              <span className="flex-1 truncate text-sm text-text-secondary">
                {affiliateUrl}
              </span>
              <button
                onClick={() => copyToClipboard(affiliateUrl, "Affiliate URL")}
                className="rounded-lg p-2 transition-colors hover:bg-surface-hover"
              >
                <Copy className="h-4 w-4 text-text-muted hover:text-text-primary" />
              </button>
            </div>

            {/* Share on Social Media */}
            <div className="flex flex-col gap-3">
              <span className="text-sm text-text-muted">Share on</span>
              <div className="flex gap-2">
                <button
                  onClick={shareOnTwitter}
                  className="cursor-pointer rounded-xl border border-border-default bg-surface p-2 text-text-primary transition-colors hover:bg-surface-hover"
                >
                  <TwitterIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={shareOnTelegram}
                  className="cursor-pointer rounded-xl border border-border-default bg-surface p-2 text-text-primary transition-colors hover:bg-surface-hover"
                >
                  <TelegramIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border-default bg-surface p-6 text-center">
            <p className="text-sm text-text-muted">
              Create your first referral code to start earning commissions
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Code
            </Button>
          </div>
        )}
        <CreateReferralCodeModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          commissionRate={levelCommission !== undefined ? levelCommission * 100 : undefined}
        />
      </div>
    </div>
  );
}
