'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { EmptyState } from '@/components/common/empty-state';
import type { CommissionActivityEntry } from '@/lib/mock-data';

function formatToCompactNumber(n: number): string {
  if (n === 0) return '-';

  if (n > 0 && n < 0.001) {
    return '<0.001';
  }

  const formatter = Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  });

  return formatter.format(n);
}

function getPayoutStatusLabel(payoutStatus: string, payoutStatusDetails?: string) {
  switch (payoutStatus) {
    case 'confirmed':
      return {
        tooltip: 'Credited to your account',
        label: 'Completed',
        variant: 'default' as const,
        className: 'bg-success/20 text-success hover:bg-success/30',
      };
    case 'sending_transaction':
      return {
        tooltip: 'Your reward is being processed',
        label: 'Sending',
        variant: 'secondary' as const,
        className: 'bg-warning/20 text-warning hover:bg-warning/30',
      };
    case 'pending_recipient_acceptance':
      return {
        tooltip: 'Waiting for you to accept this reward',
        label: 'Pending Acceptance',
        variant: 'secondary' as const,
        className: 'bg-info/20 text-info hover:bg-info/30',
      };
    case 'pending_approval':
      return {
        tooltip: `Transaction is pending manual review ${
          payoutStatusDetails ?? ''
        }`,
        label: 'Pending',
        variant: 'secondary' as const,
        className: 'bg-warning/20 text-warning hover:bg-warning/30',
      };
    case 'pending_confirmation':
    case 'pending_transaction':
      return {
        tooltip: 'Transaction is being processed',
        label: 'Pending',
        variant: 'secondary' as const,
        className: 'bg-warning/20 text-warning hover:bg-warning/30',
      };
    case 'rejected':
      return {
        tooltip: `Transaction was rejected ${payoutStatusDetails ?? ''}`,
        label: 'Rejected',
        variant: 'destructive' as const,
        className: 'bg-destructive/20 text-destructive hover:bg-destructive/30',
      };
    default:
      return {
        tooltip: payoutStatus,
        label: payoutStatus,
        variant: 'outline' as const,
        className: 'bg-surface-hover text-text-tertiary',
      };
  }
}

interface CommissionActivityTableProps {
  entries: CommissionActivityEntry[];
}

export function CommissionActivityTable({ entries }: CommissionActivityTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const formattedRows = useMemo(() => {
    return entries.map((row) => {
      return {
        ...row,
        currencySymbol: 'USDC',
        currencyLogo: '/assets/svg/usdc.svg',
        displayAmount: row.amount,
      };
    });
  }, [entries]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return formattedRows.slice(startIndex, endIndex);
  }, [formattedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(formattedRows.length / pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const hasNoData = !entries || entries.length === 0;

  return (
    <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: '140px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '180px' }} />
            <col style={{ width: '160px' }} />
          </colgroup>
          <thead>
            <tr className="border-b border-border-default">
              <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                Date
              </th>
              <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                Conversion
              </th>
              <th className="text-left py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                Reward
              </th>
              <th className="text-right py-4 px-6 sm:px-8 text-text-secondary font-semibold text-sm whitespace-nowrap">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {!hasNoData &&
              paginatedData.map((row) => {
                const statusInfo = getPayoutStatusLabel(
                  row.status,
                  row.statusDetails || undefined
                );

                return (
                  <tr
                    key={row.id}
                    className="border-b border-border-subtle hover:bg-surface transition-colors"
                  >
                    <td className="py-4 px-6 sm:px-8 text-text-primary text-sm">
                      {row.date ? format(new Date(row.date), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-text-primarytext-sm font-medium">
                      {row.conversion}
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-text-primaryfont-semibold text-sm">
                      <div className="flex items-center gap-2">
                        {row.currencyLogo && (
                          <Image
                            src={row.currencyLogo}
                            alt={row.currencySymbol}
                            width={20}
                            height={20}
                            className="rounded-full flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <span>
                          {formatToCompactNumber(row.displayAmount)} {row.currencySymbol}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 sm:px-8 text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                        title={statusInfo.tooltip}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {hasNoData && (
        <EmptyState
          icon={Gift}
          title="No commission activity yet"
          description="Complete tasks to start earning rewards"
        />
      )}

      {!hasNoData && formattedRows.length > 0 && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-4 sm:py-6 border-t border-border-default">
          <div className="flex items-center gap-6">
            <span className="text-text-tertiary text-xs sm:text-sm">
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, formattedRows.length)} of {formattedRows.length}
            </span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="hidden sm:block bg-surface text-text-primarytext-xs rounded px-2 py-1 border border-border-default hover:bg-surface-hover focus:outline-none focus:ring-1 focus:ring-border-hover cursor-pointer"
            >
              {[5, 10, 15, 20, 25, 30].map((size) => (
                <option key={size} value={size} className="bg-popover text-white">
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primarydisabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-text-tertiary text-xs sm:text-sm px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primarydisabled:opacity-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
