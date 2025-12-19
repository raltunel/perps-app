'use client';

import Image from 'next/image';
import { GlassCard } from '@/components/common/glass-card';
import { STATS_LABELS } from '@/lib/constants/stats-labels';

interface RebateRateCardProps {
  rebateRate: string;
  referredByCode: string;
  rebatesEarned: string;
  className?: string;
}

export function RebateRateCard({
  rebateRate,
  referredByCode,
  rebatesEarned,
  className,
}: RebateRateCardProps) {
  return (
    <GlassCard className={`w-full h-full ${className || ''}`}>
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-text-muted">{STATS_LABELS.YOUR_REBATE_RATE}</span>
          <span className="text-2xl font-bold text-text-primary">{rebateRate}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-text-muted">Referred By</span>
          <span className="text-lg font-semibold text-text-primary">{referredByCode}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-text-muted">Rebates Earned</span>
          <div className="flex items-center gap-2">
            <Image
              src="/assets/svg/usdc.svg"
              alt="USDC"
              width={20}
              height={20}
            />
            <span className="text-lg font-semibold text-text-primary">{rebatesEarned}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
