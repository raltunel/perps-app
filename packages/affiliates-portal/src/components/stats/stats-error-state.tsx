'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/common/glass-card';
import { ALL_STATS_LABELS } from '@/lib/constants/stats-labels';
import { useRetryWithCooldown } from '@/hooks/use-retry-with-cooldown';

interface StatsErrorStateProps {
  error: string;
  onRetry: () => void;
}

const statLabels = ALL_STATS_LABELS;

export function StatsErrorState({ error, onRetry }: StatsErrorStateProps) {
  const { cooldown, isRetrying, isDisabled, handleRetry } = useRetryWithCooldown(onRetry);
  const firstRowLabels = statLabels.slice(0, 3);
  const secondRowLabels = statLabels.slice(3);

  return (
    <GlassCard className="w-full pb-4">
      <div className="space-y-6">
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {firstRowLabels.map((label, i) => (
            <div key={i} className="space-y-2">
              <p className="text-sm text-text-muted font-medium">{label}</p>
              <div className="text-2xl sm:text-3xl font-bold text-text-subtle">-</div>
            </div>
          ))}
        </div>

        {/* Second row with dividers */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-0 md:divide-x md:divide-border-hover">
          {secondRowLabels.map((label, i) => (
            <div key={i} className="space-y-1 md:px-3 first:md:pl-0 min-w-[150px]">
              <p className="text-sm text-text-muted font-medium">{label}</p>
              <div className="text-lg sm:text-xl font-semibold text-text-subtle">-</div>
            </div>
          ))}
        </div>

        {/* Error message overlay */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4 border-t border-border-default">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>

          <button
            onClick={handleRetry}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
              isDisabled
                ? 'bg-surface-hover text-text-subtle cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? `Retry in ${cooldown}s` : isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
