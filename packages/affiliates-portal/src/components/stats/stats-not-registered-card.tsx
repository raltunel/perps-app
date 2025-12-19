'use client';

import { Info } from 'lucide-react';
import { GlassCard } from '@/components/common/glass-card';

export function StatsNotRegisteredCard() {
  return (
    <GlassCard className="w-full h-full">
      <div className="flex flex-col items-center justify-center space-y-4 py-16 px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Info className="w-8 h-8 text-blue-400" />
        </div>

        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <h3 className="text-xl font-semibold text-text-primary">
            No data available yet
          </h3>
          <p className="text-sm text-text-muted">
            It looks like you haven't registered as an affiliate yet or there's no activity associated with this wallet.
          </p>
          <p className="text-sm text-text-subtle mt-2">
            Start sharing your referral links to see your stats here!
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
