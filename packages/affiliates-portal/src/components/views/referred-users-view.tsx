'use client';

import { useState } from 'react';
import { ReferredUsersTableRow } from '@/components/referred-users/referred-users-table-row';
import { ReferredUsersTableSkeleton } from '@/components/referred-users/referred-users-table-skeleton';
import { EmptyState } from '@/components/common/empty-state';
import { ConnectWalletCard } from '@/components/auth/connect-wallet-card';
import { TableErrorState } from '@/components/common/table-error-state';
import { ViewLayout } from './view-layout';
import { useAuth } from '@/hooks/auth/use-auth';
import { usePayoutsByReferrer } from '@/lib/api/hooks';
import { Users, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function ReferredUsersView() {
  const { isConnected, walletAddress } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error, refetch } = usePayoutsByReferrer(
    walletAddress || '',
    isConnected && !!walletAddress
  );

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Filter data based on search query
  const filteredData = (data || []).filter((entry) => {
    const userId = Object.keys(entry)[0].toLowerCase();
    return userId.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // Show not-connected state
  if (!isConnected) {
    return (
      <ViewLayout title="Affiliate History">
        <ConnectWalletCard
          title="Connect to view referred users"
          description="Sign in to see users you've referred and their activity"
        />
      </ViewLayout>
    );
  }

  if (isLoading) {
    return (
      <ViewLayout title="Affiliate History">
        <ReferredUsersTableSkeleton />
      </ViewLayout>
    );
  }

  if (error) {
    return (
      <ViewLayout title="Affiliate History">
        <TableErrorState
          error={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={() => refetch()}
        />
      </ViewLayout>
    );
  }

  const hasNoData = !data || data.length === 0;

  return (
    <ViewLayout title="Affiliate History">
      <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default overflow-hidden">
        {/* Search Input */}
        <div className="p-4 sm:p-6 border-b border-border-default">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
            <input
              type="text"
              placeholder="Search by user address..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border-default rounded-lg text-white placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-border-hover focus:border-border-hover transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left py-4 px-4 sm:px-6 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  User
                </th>
                <th className="text-left py-4 px-4 sm:px-6 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Date Joined
                </th>
                <th className="text-left py-4 px-4 sm:px-6 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Rebate Rate
                </th>
                <th className="text-left py-4 px-4 sm:px-6 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Volume
                </th>
                <th className="text-right py-4 px-4 sm:px-6 text-text-secondary font-semibold text-sm whitespace-nowrap">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody>
              {!hasNoData &&
                currentData.map((entry, index) => {
                  const userId = Object.keys(entry)[0];
                  const userData = entry[userId];
                  return (
                    <ReferredUsersTableRow
                      key={index}
                      userId={userId}
                      data={userData}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>

        {hasNoData && (
          <EmptyState
            icon={Users}
            title="No referred users yet"
            description="Start referring users to see their activity and earnings here"
          />
        )}

        {!hasNoData && filteredData.length === 0 && (
          <div className="py-12 text-center">
            <Search className="w-12 h-12 text-text-subtle mx-auto mb-4" />
            <p className="text-text-muted text-sm">No users found matching "{searchQuery}"</p>
          </div>
        )}

        {!hasNoData && (
          <div className="flex items-center justify-between px-3 sm:px-4 py-4 sm:py-6 border-t border-border-default">
            <div className="flex items-center gap-6">
              <span className="text-text-tertiary text-xs sm:text-sm">
                {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
                {searchQuery && filteredData.length !== (data || []).length && (
                  <span className="ml-1">({(data || []).length} total)</span>
                )}
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="hidden sm:block bg-surface text-white text-xs rounded px-2 py-1 border border-border-default hover:bg-surface-hover focus:outline-none focus:ring-1 focus:ring-border-hover cursor-pointer"
              >
                {[5, 10, 15, 20, 25, 30].map((size) => (
                  <option key={size} value={size} className="bg-gray-900 text-text-primary">
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-white disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-text-tertiary text-xs sm:text-sm px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-white disabled:opacity-50 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ViewLayout>
  );
}
