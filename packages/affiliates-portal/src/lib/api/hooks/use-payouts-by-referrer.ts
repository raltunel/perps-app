import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType, ReferrerPayoutData } from "@fuul/sdk";

export interface ReferredUserData {
  volume: number;
  earnings: {
    currency: {
      address: string | null;
      chainId: string | null;
    };
    amount: number;
  }[];
  dateJoined: string;
  rebateRate: number;
}

export type ReferredUserEntry = Record<string, ReferredUserData>;

const transformPayoutsData = (
  response: Array<Record<string, ReferrerPayoutData>>
): ReferredUserEntry[] => {
  return response.map((item) => {
    const userId = Object.keys(item)[0];
    const userData = item[userId];

    // Transform snake_case to camelCase
    const transformedData: ReferredUserData = {
      volume: userData.volume,
      earnings: userData.earnings,
      dateJoined: userData.date_joined,
      rebateRate: (userData.user_rebate_rate ?? 0) * 100,
    };

    return { [userId]: transformedData };
  });
};

export const payoutsByReferrerKeys = {
  all: ["payouts-by-referrer"] as const,
  byUser: (userIdentifier: string) =>
    [...payoutsByReferrerKeys.all, userIdentifier] as const,
};

export const usePayoutsByReferrer = (userIdentifier: string, enabled = true) => {
  return useQuery({
    queryKey: payoutsByReferrerKeys.byUser(userIdentifier),
    queryFn: async () => {
      const response = await Fuul.getPayoutsByReferrer({
        user_identifier: userIdentifier,
        user_identifier_type: UserIdentifierType.SolanaAddress,
      });

      return transformPayoutsData(response);
    },
    enabled: enabled && !!userIdentifier,
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: 30000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
