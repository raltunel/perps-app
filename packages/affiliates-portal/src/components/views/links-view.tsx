'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Link2, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Fuul, UserIdentifierType } from '@fuul/sdk';
import { LinksTableSkeleton } from '@/components/links/links-table-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { ConnectWalletCard } from '@/components/auth/connect-wallet-card';
import { TableErrorState } from '@/components/common/table-error-state';
import { ViewLayout } from './view-layout';
import { useAuth } from '@/hooks/auth/use-auth';
import { useAffiliateAudience } from '@/lib/api';
import { formatUSD } from '@/lib/utils/format-numbers';
import { getCommissionByAudienceId } from '@/lib/constants/affiliate-levels';
import { LinkActionsMenu } from '@/components/links/link-actions-menu';
import { CreateReferralCodeModal } from '@/components/forms/create-referral-code-modal';
import { EditCommissionSplitModal } from '@/components/forms/edit-commission-split-modal';
import { Button } from '@/components/ui/button';

export function LinksView() {
  const { isConnected, walletAddress } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<{ code: string; currentSplit: number } | null>(null);

  const { data: audienceData } = useAffiliateAudience(
    walletAddress || '',
    isConnected && !!walletAddress
  );

  const {
    data: affiliateCode,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['affiliateCode', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return null;
      return await Fuul.getAffiliateCode(walletAddress, UserIdentifierType.SolanaAddress);
    },
    enabled: isConnected && !!walletAddress,
  });

  const audienceId = audienceData?.audiences?.results?.[0]?.id;
  const levelCommission = audienceId ? getCommissionByAudienceId(audienceId) ?? 0.2 : 0.2;
  const commissionRatePercent = levelCommission * 100;

  const handleEditCommission = (code: string, currentSplit: number) => {
    setEditingCode({ code, currentSplit });
  };

  // Create data based on the affiliate code
  const userRebateRate = affiliateCode?.user_rebate_rate ?? 0;
  const inviteePercent = userRebateRate * 100;
  const youPercent = commissionRatePercent - inviteePercent;
  // Calculate split percentage (0-50) for the slider
  const inviteeSplitPercent = commissionRatePercent > 0 ? (inviteePercent / commissionRatePercent) * 100 : 0;

  const data = affiliateCode
    ? [
        {
          code: affiliateCode.code,
          created_at: affiliateCode.created_at,
          clicks: affiliateCode.clicks,
          total_users: affiliateCode.total_users,
          total_earnings: affiliateCode.total_earnings,
          you_percentage: youPercent,
          invitee_percentage: inviteePercent,
          invitee_split_percent: inviteeSplitPercent,
        },
      ]
    : [];

  // Show not-connected state
  if (!isConnected) {
    return (
      <ViewLayout title="Links">
        <ConnectWalletCard
          title="Connect to view your links"
          description="Sign in to track your referral link performance and analytics"
        />
      </ViewLayout>
    );
  }

  if (isLoading) {
    return (
      <ViewLayout title="Links">
        <LinksTableSkeleton />
      </ViewLayout>
    );
  }

  if (error) {
    return (
      <ViewLayout title="Links">
        <TableErrorState error={error instanceof Error ? error.message : 'An error occurred'} onRetry={refetch} />
      </ViewLayout>
    );
  }

  const hasNoData = data.length === 0;

  return (
    <ViewLayout
      title="Links"
      actions={
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Code
        </Button>
      }
    >
      <CreateReferralCodeModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        commissionRate={commissionRatePercent}
      />
      {editingCode && (
        <EditCommissionSplitModal
          open={true}
          onClose={() => setEditingCode(null)}
          code={editingCode.code}
          currentSplit={editingCode.currentSplit}
          commissionRate={commissionRatePercent}
        />
      )}
      <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '140px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '180px' }} />
              <col style={{ width: '120px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '60px' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Code
                </th>
                <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Date Created
                </th>
                <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm">
                  <div>Commission Rate</div>
                  <div className="text-xs font-normal text-text-muted">(You/Invitee)</div>
                </th>
                <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Clicks
                </th>
                <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Total Users
                </th>
                <th className="text-right py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Total Earnings
                </th>
                <th className="text-center py-4 px-4 text-text-secondary font-semibold text-sm"></th>
              </tr>
            </thead>
            <tbody>
              {!hasNoData &&
                data.map((entry) => (
                  <tr
                    key={entry.code}
                    className="border-b border-border-subtle hover:bg-surface transition-colors"
                  >
                    <td className="py-4 px-6 sm:px-8 text-white font-mono text-xs sm:text-sm font-semibold">
                      {entry.code}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-text-primary text-sm">
                      {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-sm">
                      <span className="text-text-primary">{entry.you_percentage}% / {entry.invitee_percentage}%</span>
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-white text-sm">
                      {entry.clicks.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-white text-sm">
                      {entry.total_users.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-right font-bold text-sm sm:text-base text-green-400">
                      ${formatUSD(entry.total_earnings)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <LinkActionsMenu
                        code={entry.code}
                        currentSplit={entry.invitee_split_percent}
                        onEditCommission={handleEditCommission}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {hasNoData && (
          <EmptyState
            icon={Link2}
            title="No referral links yet"
            description="Create your first referral link to start tracking performance"
          />
        )}
      </div>
    </ViewLayout>
  );
}
