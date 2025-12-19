'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { useRetryWithCooldown } from '@/hooks/use-retry-with-cooldown';

interface TableErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function TableErrorState({ error, onRetry }: TableErrorStateProps) {
  const { cooldown, isRetrying, isDisabled, handleRetry } = useRetryWithCooldown(onRetry);

  return (
    <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default p-8 sm:p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
        <AlertCircle className="w-16 h-16 text-destructive/70" />

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-primary">Something went wrong</h3>
          <p className="text-text-muted text-sm sm:text-base max-w-md">{error}</p>
        </div>

        <button
          onClick={handleRetry}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
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
  );
}
