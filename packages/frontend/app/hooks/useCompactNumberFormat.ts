import { useMemo } from 'react';

interface NumberFormatOptions {
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
    threshold?: number;
}

export const useNumberFormatter = () => {
    const formatNumber = useMemo(() => {
        return (value: number, options: NumberFormatOptions = {}): string => {
            const {
                currency = 'USD',
                minimumFractionDigits = 0,
                maximumFractionDigits = 2,
                compact = false,
                threshold = 10000,
            } = options;

            // Use regular formatting if not compact or below threshold
            if (!compact || Math.abs(value) < threshold) {
                return new Intl.NumberFormat('en-US', {
                    style: currency ? 'currency' : 'decimal',
                    currency: currency || undefined,
                    minimumFractionDigits,
                    maximumFractionDigits,
                }).format(value);
            }

            // Use compact notation for large numbers
            return new Intl.NumberFormat('en-US', {
                style: currency ? 'currency' : 'decimal',
                currency: currency || undefined,
                notation: 'compact',
                compactDisplay: 'short',
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
            }).format(value);
        };
    }, []);

    const currency = useMemo(() => {
        return (
            value: number,
            compact = false,
            currencyCode = 'USD',
            threshold = 10000,
        ): string => {
            return formatNumber(value, {
                currency: currencyCode,
                compact,
                threshold,
                maximumFractionDigits:
                    compact && Math.abs(value) >= threshold ? 1 : 2,
            });
        };
    }, [formatNumber]);

    const percentage = useMemo(() => {
        return (value: number, compact = false, threshold = 100): string => {
            if (!compact || Math.abs(value) < threshold) {
                return `${value}%`;
            }

            return `${formatNumber(value, {
                currency: undefined,
                compact,
                threshold,
            })}%`;
        };
    }, [formatNumber]);

    return {
        formatNumber,
        currency,
        percentage,
    };
};
