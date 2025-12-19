import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";

export interface UserPayoutMovement {
  date: string;
  currency_address: string;
  chain_id: number;
  is_referrer: boolean;
  conversion_id: string;
  conversion_name: string;
  total_amount: string;
  project_name: string;
  payout_status: string;
  payout_status_details: string | null;
}

export interface UserPayoutMovementsResponse {
  total_results: number;
  page: number;
  page_size: number;
  results: UserPayoutMovement[];
}

export const userPayoutMovementsKeys = {
  all: ["user-payout-movements"] as const,
  byUser: (userIdentifier: string) =>
    [...userPayoutMovementsKeys.all, userIdentifier] as const,
};

export const useUserPayoutMovements = (userIdentifier: string, enabled = true) => {
  return useQuery<UserPayoutMovementsResponse>({
    queryKey: userPayoutMovementsKeys.byUser(userIdentifier),
    queryFn: async () => {
      const response = await Fuul.getUserPayoutMovements({
        user_identifier: userIdentifier,
        identifier_type: UserIdentifierType.SolanaAddress,
      });

      return response;
    },
    enabled: enabled && !!userIdentifier,
    staleTime: 30000,
    gcTime: 300000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
