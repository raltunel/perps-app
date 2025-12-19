'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/common/glass-card';

interface StatsErrorLayoutProps {
  error: string;
  onRetry: () => void;
}

export function StatsErrorLayout({ error, onRetry }: StatsErrorLayoutProps) {
  const [cooldown, setCooldown] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRetry = async () => {
    if (cooldown > 0 || isRetrying) return;

    setIsRetrying(true);
    setCooldown(10);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  const isDisabled = cooldown > 0 || isRetrying;

  return (
    <div className="col-span-full">
      <GlassCard className="w-full">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="flex items-center gap-2 text-red-400">
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
      </GlassCard>
    </div>
  );
}
