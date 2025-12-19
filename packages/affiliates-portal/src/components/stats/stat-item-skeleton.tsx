import { Skeleton } from '@/components/ui/skeleton';

interface StatItemSkeletonProps {
  lighter?: boolean;
}

export function StatItemSkeleton({ lighter = false }: StatItemSkeletonProps) {
  const skeletonHeight = lighter ? 'h-5 sm:h-6' : 'h-6 sm:h-8';
  const containerClasses = lighter
    ? 'space-y-1 md:px-3 first:md:pl-0 min-w-[150px]'
    : 'space-y-2';

  return (
    <div className={containerClasses}>
      <Skeleton className="h-4 w-32 bg-surface-hover" />
      <Skeleton className={`${skeletonHeight} w-24 bg-surface-active`} />
    </div>
  );
}
