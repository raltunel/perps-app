"use client";

import { useMemo } from "react";
import { SectionTitle } from "./section-title";
import { StatsLayout } from "./stats-layout";
import { StatsLayoutNotRegistered } from "./stats-layout-not-registered";
import { SingleStatCard } from "./single-stat-card";
import { RebateRateCard } from "./rebate-rate-card";
import {
  SingleStatCardSkeleton,
  RebateRateCardSkeleton,
  SmallCardSkeleton,
} from "./stats-card-skeleton";
import { SmallCardPlaceholder } from "./small-card-placeholder";
import { StatsErrorLayout } from "./stats-error-layout";
import { StatsNotRegisteredCard } from "./stats-not-registered-card";
import { useAuth } from "@/hooks/auth/use-auth";
import { STATS_LABELS } from "@/lib/constants/stats-labels";
import { useAffiliateStats, useUserReferrer, useUserPayoutMovements } from "@/lib/api";
import { formatLargeNumber } from "@/lib/utils/format-numbers";
import { formatTokenAmount } from "@/lib/utils/non-evm-currency";

export function YourStatsSection() {
  const { isConnected, walletAddress } = useAuth();
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useAffiliateStats(walletAddress || "", isConnected && !!walletAddress);
  const { data: referrerData } = useUserReferrer(
    walletAddress || "",
    isConnected && !!walletAddress
  );

  const userRebateRate = useMemo(() => {
    if (!referrerData) {
      return null;
    }
    return referrerData.referrer_user_rebate_rate ?? null;
  }, [referrerData]);

  const { data: payoutMovements } = useUserPayoutMovements(
    walletAddress || "",
    isConnected && !!walletAddress
  );

  const endUserMovements = useMemo(
    () => payoutMovements?.results?.filter((movement) => !movement.is_referrer) ?? [],
    [payoutMovements]
  );

  const rebatesEarned = useMemo(() => {
    return endUserMovements.reduce((sum, movement) => {
      const amount = Number(
        formatTokenAmount(Number(movement.total_amount), 6).replace(/,/g, "")
      );
      return sum + amount;
    }, 0);
  }, [endUserMovements]);

  const getUSDAmount = (
    earnings: Array<{ amount: number; currency: string }> | null | undefined
  ): number | null => {
    if (!earnings || earnings.length === 0) return null;
    const usdEarning = earnings.find((e) => e.currency === "USD");
    return usdEarning?.amount ?? null;
  };

  const affiliateEarnings = isConnected
    ? `$${formatLargeNumber(getUSDAmount(stats?.total_earnings) ?? 0)}`
    : "-";
  const volumeReferred = isConnected
    ? stats?.referred_volume !== null && stats?.referred_volume !== undefined
      ? `$${formatLargeNumber(stats.referred_volume)}`
      : "-"
    : "-";
  const newTraders = isConnected
    ? formatLargeNumber(stats?.newTraders ?? 0)
    : "-";
  const activeTraders = isConnected
    ? formatLargeNumber(stats?.activeTraders ?? 0)
    : "-";
  const invitees = isConnected
    ? formatLargeNumber(stats?.referred_users ?? 0)
    : "-";

  const isNotRegistered = stats && stats.isRegistered === false;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <SectionTitle>Overview</SectionTitle>

      {error ? (
        <StatsErrorLayout
          error={error.message || "An error occurred"}
          onRetry={() => refetch()}
        />
      ) : isNotRegistered ? (
        <StatsLayoutNotRegistered
          notRegisteredCard={<StatsNotRegisteredCard />}
          currentLevelCard={<SmallCardPlaceholder />}
        />
      ) : (
        <StatsLayout
          feesEarnedCard={
            isLoading ? (
              <SingleStatCardSkeleton label={STATS_LABELS.FEES_EARNED} />
            ) : (
              <SingleStatCard
                label={STATS_LABELS.FEES_EARNED}
                value={affiliateEarnings}
              />
            )
          }
          allTimeRankCard={
            isLoading ? (
              <SingleStatCardSkeleton label={STATS_LABELS.ACTIVE_TRADERS} />
            ) : (
              <SingleStatCard
                label={STATS_LABELS.ACTIVE_TRADERS}
                value={activeTraders}
                tooltip="Active Invitee who made at least one trade in the last 30 days"
              />
            )
          }
          rebateRateCard={
            isLoading ? (
              <RebateRateCardSkeleton />
            ) : (
              <RebateRateCard
                rebateRate={userRebateRate !== null ? `${(userRebateRate * 100).toFixed(0)}%` : "-"}
                referredByCode={referrerData?.referrer_code ?? "-"}
                rebatesEarned={formatLargeNumber(rebatesEarned)}
              />
            )
          }
          tradingVolumeCard={
            isLoading ? (
              <SingleStatCardSkeleton
                label={STATS_LABELS.TRADING_VOLUME}
              />
            ) : (
              <SingleStatCard
                label={STATS_LABELS.TRADING_VOLUME}
                value={volumeReferred}
                tooltip="Invitees Trading Volume"
              />
            )
          }
          newTradersCard={
            isLoading ? (
              <SingleStatCardSkeleton label={STATS_LABELS.NEW_TRADERS} />
            ) : (
              <SingleStatCard
                label={STATS_LABELS.NEW_TRADERS}
                value={newTraders}
                tooltip="Number of invitees who made their first trade"
              />
            )
          }
          inviteesCard={
            isLoading ? (
              <SingleStatCardSkeleton label={STATS_LABELS.INVITEES} />
            ) : (
              <SingleStatCard
                label={STATS_LABELS.INVITEES}
                value={invitees}
                tooltip="Number of users who joined the affiliate program with your code."
              />
            )
          }
          currentLevelCard={
            isLoading ? <SmallCardSkeleton /> : <SmallCardPlaceholder />
          }
        />
      )}
    </section>
  );
}
