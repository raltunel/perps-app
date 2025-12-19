'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseRetryWithCooldownOptions {
  cooldownSeconds?: number;
}

interface UseRetryWithCooldownResult {
  cooldown: number;
  isRetrying: boolean;
  isDisabled: boolean;
  handleRetry: () => Promise<void>;
}

export function useRetryWithCooldown(
  onRetry: () => void | Promise<void>,
  options: UseRetryWithCooldownOptions = {}
): UseRetryWithCooldownResult {
  const { cooldownSeconds = 10 } = options;
  const [cooldown, setCooldown] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRetry = useCallback(async () => {
    if (cooldown > 0 || isRetrying) return;

    setIsRetrying(true);
    setCooldown(cooldownSeconds);

    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  }, [cooldown, isRetrying, cooldownSeconds, onRetry]);

  const isDisabled = cooldown > 0 || isRetrying;

  return {
    cooldown,
    isRetrying,
    isDisabled,
    handleRetry,
  };
}
