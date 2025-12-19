import { Skeleton } from '@/components/ui/skeleton';

export function CommissionActivityTableSkeleton({ rows = 5 }: { rows?: number }) {
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
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-border-subtle">
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-24 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <Skeleton className="h-4 w-32 bg-surface-active" />
                </td>
                <td className="py-4 px-6 sm:px-8">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded-full bg-surface-active" />
                    <Skeleton className="h-4 w-20 bg-surface-active" />
                  </div>
                </td>
                <td className="py-4 px-6 sm:px-8 text-right">
                  <Skeleton className="h-6 w-20 rounded-full bg-surface-active ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
