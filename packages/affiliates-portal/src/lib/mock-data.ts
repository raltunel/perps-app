/**
 * Mock Data for Demo Application
 *
 * This file contains all mock/fake data used in the demo.
 * Replace with real API calls when integrating with backend.
 */

// Simulate loading delay
export const simulateLoading = (delay: number = 2000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

// Type used by commission activity (data comes from SDK)
export interface CommissionActivityEntry {
  id: string;
  date: string;
  conversion: string;
  amount: number;
  currencyAddress: string | null;
  chainId: number | null;
  status: string;
  statusDetails?: string | null;
}
