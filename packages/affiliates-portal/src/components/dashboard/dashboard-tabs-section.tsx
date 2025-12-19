'use client';

import React, { useMemo, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TabController, TabContent, DashboardTab, type DashboardTabContentMap } from '@/components/tabs';
import { DASHBOARD_TAB_CONFIGS } from '@/lib/config/dashboard-tabs';
import { ReferredUsersView, LinksView, CommissionActivityView, ResourcesView } from '@/components/views';
import { ReferredUsersTableSkeleton } from '@/components/referred-users/referred-users-table-skeleton';
import { ViewLayout } from '@/components/views/view-layout';

function DashboardTabsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState(searchParams.get("view") || "affiliate-history");

  useEffect(() => {
    const viewParam = searchParams.get("view");
    if (viewParam) {
      setView(viewParam);
    } else {
      router.replace("/?view=affiliate-history", { scroll: false });
    }
  }, [searchParams, router]);

  const selectedTab = useMemo(() => {
    if (!view) return DashboardTab.ReferredUsers;
    return (view as DashboardTab) || DashboardTab.ReferredUsers;
  }, [view]);

  const tabContentMap: DashboardTabContentMap = useMemo(
    () => ({
      [DashboardTab.ReferredUsers]: <ReferredUsersView />,
      [DashboardTab.Links]: <LinksView />,
      [DashboardTab.CommissionActivity]: <CommissionActivityView />,
      [DashboardTab.Resources]: <ResourcesView />,
    }),
    []
  );

  const handleTabChange = (newTab: DashboardTab) => {
    router.push(`/?view=${newTab}`, { scroll: false });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <TabController
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        tabConfigs={DASHBOARD_TAB_CONFIGS}
      />

      <TabContent selectedTab={selectedTab} tabContentMap={tabContentMap} />
    </section>
  );
}

export function DashboardTabsSection() {
  return (
    <Suspense
      fallback={
        <section className="w-full max-w-7xl mx-auto px-4 py-8">
          <ViewLayout title="Affiliate History">
            <ReferredUsersTableSkeleton />
          </ViewLayout>
        </section>
      }
    >
      <DashboardTabsContent />
    </Suspense>
  );
}
