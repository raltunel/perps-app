import { GlassCard } from '@/components/common/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { STATS_LABELS } from '@/lib/constants/stats-labels';

export function SingleStatCardSkeleton({ label }: { label: string }) {
  return (
    <GlassCard className="w-full h-full">
      <div className="flex flex-col space-y-2 h-full">
        <span className="text-sm font-medium text-text-muted">{label}</span>
        <Skeleton className="h-8 w-24 bg-surface-active" />
      </div>
    </GlassCard>
  );
}

export function RebateRateCardSkeleton() {
  return (
    <GlassCard className="w-full h-full">
      <div className="flex flex-col space-y-4 h-full">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-text-muted">{STATS_LABELS.YOUR_REBATE_RATE}</span>
          <Skeleton className="h-8 w-16 bg-surface-active" />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-text-muted">Referred By</span>
          <Skeleton className="h-6 w-24 bg-surface-active" />
        </div>
      </div>
    </GlassCard>
  );
}

export function SmallCardSkeleton() {
  return (
    <GlassCard className="w-full h-full">
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col space-y-4 flex-1">
          {/* Icon + Title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded bg-surface-active" />
            <Skeleton className="h-6 w-40 bg-surface-active" />
          </div>

          {/* Description text */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full bg-surface-hover" />
            <Skeleton className="h-4 w-3/4 bg-surface-hover" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-12 w-full rounded-xl bg-surface-active mt-4" />
      </div>
    </GlassCard>
  );
}
