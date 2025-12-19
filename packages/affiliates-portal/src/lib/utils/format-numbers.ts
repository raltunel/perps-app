/**
 * Format large numbers with K, M, B suffixes
 * @param value - The number to format
 * @returns Formatted string with suffix
 *
 * Examples:
 * - 45,678 -> "45,678"
 * - 100,000 -> "100K"
 * - 567,890 -> "567K"
 * - 1,500,000 -> "1.5M"
 * - 2,300,000,000 -> "2.3B"
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 100000) {
    return `${Math.floor(value / 1000)}K`;
  }
  return value.toLocaleString();
}

/**
 * Format a number as USD currency
 * @param value - The number to format
 * @returns Formatted string with USD formatting (uses K, M, B for large numbers)
 *
 * Examples:
 * - 12054 -> "12,054"
 * - 1234.56 -> "1,234.56"
 * - 100000 -> "100K"
 * - 1500000 -> "1.5M"
 */
export function formatUSD(value: number): string {
  return formatLargeNumber(value);
}
