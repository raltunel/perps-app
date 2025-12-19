import { Skeleton } from '@/components/ui/skeleton';

export function LinksTableSkeleton() {
  return (
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
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border-subtle">
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-20 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-24 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-16 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-12 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-12 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8 text-right">
                  <Skeleton className="h-4 w-20 bg-surface-active ml-auto" />
                </td>
                <td className="py-4 px-4 text-center">
                  <Skeleton className="h-8 w-8 bg-surface-active mx-auto rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
