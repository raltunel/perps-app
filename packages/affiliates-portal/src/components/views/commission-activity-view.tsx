'use client';

import { useMemo } from 'react';
import { CommissionActivityTable } from '@/components/commission-activity/commission-activity-table';
import { CommissionActivityTableSkeleton } from '@/components/commission-activity/commission-activity-table-skeleton';
import { ConnectWalletCard } from '@/components/auth/connect-wallet-card';
import { TableErrorState } from '@/components/common/table-error-state';
import { ViewLayout } from './view-layout';
import type { CommissionActivityEntry } from '@/lib/mock-data';
import { useAuth } from '@/hooks/auth/use-auth';
import { useUserPayoutMovements, type UserPayoutMovement } from '@/lib/api/hooks';

export function CommissionActivityView() {
  const { isConnected, walletAddress } = useAuth();

  const {
    data: payoutMovementsData,
    isLoading,
    error,
    refetch,
  } = useUserPayoutMovements(walletAddress ?? '', isConnected && !!walletAddress);

  const data: CommissionActivityEntry[] = useMemo(() => {
    if (!payoutMovementsData?.results) return [];

    return payoutMovementsData.results.map((movement: UserPayoutMovement, index: number) => ({
      id: `${movement.conversion_id}-${index}`,
      date: movement.date,
      conversion: movement.conversion_name,
      amount: Number(movement.total_amount),
      currencyAddress: movement.currency_address,
      chainId: movement.chain_id,
      status: movement.payout_status,
      statusDetails: movement.payout_status_details,
    }));
  }, [payoutMovementsData]);

  // Show not-connected state
  if (!isConnected) {
    return (
      <ViewLayout title="Commission Activity">
        <ConnectWalletCard
          title="Connect to view commission activity"
          description="Sign in to see your earnings history and reward transactions"
        />
      </ViewLayout>
    );
  }

  if (isLoading) {
    return (
      <ViewLayout title="Commission Activity">
        <CommissionActivityTableSkeleton />
      </ViewLayout>
    );
  }

  if (error) {
    return (
      <ViewLayout title="Commission Activity">
        <TableErrorState error={error instanceof Error ? error.message : 'An error occurred'} onRetry={refetch} />
      </ViewLayout>
    );
  }

  return (
    <ViewLayout title="Commission Activity">
      <CommissionActivityTable entries={data} />
    </ViewLayout>
  );
}
