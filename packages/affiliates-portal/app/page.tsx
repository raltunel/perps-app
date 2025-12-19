"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { YourStatsSection } from "@/components/stats/your-stats-section";
import { DashboardTabsSection } from "@/components/dashboard/dashboard-tabs-section";
import { AffiliateApplicationForm } from "@/components/forms/affiliate-application-form";
import { ConnectWalletCard } from "@/components/auth/connect-wallet-card";
import { useAuth } from "@/hooks/auth/use-auth";
import { useAffiliateAudience } from "@/lib/api";
import { Loader2 } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );
}

export default function Home() {
  const { isConnected, isInitializing, walletAddress } = useAuth();
  const { data: audience, isLoading: isLoadingAudience } = useAffiliateAudience(
    walletAddress || "",
    isConnected && !!walletAddress
  );

  if (isInitializing) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!isConnected) {
    return (
      <AppLayout>
        <div className="flex h-full min-h-[calc(100vh-8rem)] items-center justify-center px-4">
          <ConnectWalletCard
            title="Connect your wallet"
            description="Connect your wallet to access the affiliate portal"
          />
        </div>
      </AppLayout>
    );
  }

  if (isLoadingAudience) {
    return (
      <AppLayout>
        <PageLoader />
      </AppLayout>
    );
  }

  if (!audience?.isAffiliateAccepted) {
    return (
      <AppLayout>
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <h1 className="mb-12 text-center text-4xl font-bold text-white">
            Affiliate Application Form
          </h1>
          <AffiliateApplicationForm />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <section className="mx-auto mt-[5rem] w-full max-w-7xl px-4">
        <h1 className="mb-2 text-4xl font-bold text-white">
          Referral Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your earnings as they grow with every referral.
        </p>
      </section>
      <YourStatsSection />
      <DashboardTabsSection />
    </AppLayout>
  );
}
