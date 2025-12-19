import type { ReferredUserEntry } from '@/lib/api/hooks/use-payouts-by-referrer';
import { ReferredUsersTableRow } from './referred-users-table-row';

interface ReferredUsersTableProps {
  entries: ReferredUserEntry[];
}

export function ReferredUsersTable({ entries }: ReferredUsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-border-default">
            <th className="text-left py-4 px-4 sm:px-6 text-text-tertiary text-sm font-medium whitespace-nowrap">User</th>
            <th className="text-left py-4 px-4 sm:px-6 text-text-tertiary text-sm font-medium whitespace-nowrap">Date Joined</th>
            <th className="text-left py-4 px-4 sm:px-6 text-text-tertiary text-sm font-medium whitespace-nowrap">Rebate Rate</th>
            <th className="text-left py-4 px-4 sm:px-6 text-text-tertiary text-sm font-medium whitespace-nowrap">Volume</th>
            <th className="text-right py-4 px-4 sm:px-6 text-text-tertiary text-sm font-medium whitespace-nowrap">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const userId = Object.keys(entry)[0];
            const userData = entry[userId];
            return (
              <ReferredUsersTableRow
                key={userId || index}
                userId={userId}
                data={userData}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
