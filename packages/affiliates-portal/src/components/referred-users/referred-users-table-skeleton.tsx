import { Skeleton } from '@/components/ui/skeleton';

export function ReferredUsersTableSkeleton() {
  return (
    <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default overflow-hidden">
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
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-border-subtle">
                <td className="py-4 px-4 sm:px-6">
                  <Skeleton className="h-4 w-28 bg-surface-active" />
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <Skeleton className="h-4 w-24 bg-surface-active" />
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <Skeleton className="h-4 w-12 bg-surface-active" />
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <Skeleton className="h-4 w-32 bg-surface-active" />
                </td>
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full bg-surface-active" />
                      <Skeleton className="h-4 w-24 bg-surface-active" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded-full bg-surface-active" />
                      <Skeleton className="h-4 w-20 bg-surface-active" />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
