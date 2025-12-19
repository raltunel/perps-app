import Image from 'next/image';
import { format } from 'date-fns';
import type { ReferredUserData } from '@/lib/api/hooks/use-payouts-by-referrer';
import { maskUserAddress } from '@/lib/utils';
import { formatTokenAmount } from '@/lib/utils/non-evm-currency';
import { formatUSD } from '@/lib/utils/format-numbers';

interface ReferredUsersTableRowProps {
  userId: string;
  data: ReferredUserData;
}

export function ReferredUsersTableRow({ userId, data }: ReferredUsersTableRowProps) {
  // Sum all earnings as USDC (6 decimals)
  const totalEarnings = data.earnings.reduce((sum, earning) => {
    return sum + Number(formatTokenAmount(earning.amount, 6).replace(/,/g, ''));
  }, 0);

  return (
    <tr className="border-b border-border-subtle hover:bg-surface transition-colors">
      {/* User */}
      <td className="py-4 px-4 sm:px-6 text-white font-mono text-xs sm:text-sm align-top">
        {maskUserAddress(userId)}
      </td>

      {/* Date Joined */}
      <td className="py-4 px-4 sm:px-6 text-text-primary text-sm align-top">
        {format(new Date(data.dateJoined), 'MMM dd, yyyy')}
      </td>

      {/* Rebate Rate */}
      <td className="py-4 px-4 sm:px-6 text-white text-sm sm:text-base font-medium align-top">
        {data.rebateRate}%
      </td>

      {/* Volume */}
      <td className="py-4 px-4 sm:px-6 text-white text-sm sm:text-base font-medium align-top">
        ${formatUSD(data.volume)} USD
      </td>

      {/* Earnings */}
      <td className="py-4 px-4 sm:px-6 text-right align-top">
        <div className="flex items-center gap-2 justify-end">
          <Image
            src="/assets/svg/usdc.svg"
            alt="USDC"
            width={20}
            height={20}
            className="flex-shrink-0 rounded-full"
          />
          <span className="text-white text-sm sm:text-base">
            {formatUSD(totalEarnings)}
          </span>
        </div>
      </td>
    </tr>
  );
}
