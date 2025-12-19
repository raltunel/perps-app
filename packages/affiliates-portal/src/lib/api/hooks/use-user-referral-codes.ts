import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType, ListUserReferralCodesResponse } from "@fuul/sdk";

export const userReferralCodesKeys = {
  all: ["user-referral-codes"] as const,
  byUser: (userIdentifier: string, page: number, pageSize: number) =>
    [...userReferralCodesKeys.all, userIdentifier, page, pageSize] as const,
};

export const useUserReferralCodes = (
  userIdentifier: string,
  page = 1,
  pageSize = 25,
  enabled = true
) => {
  return useQuery<ListUserReferralCodesResponse>({
    queryKey: userReferralCodesKeys.byUser(userIdentifier, page, pageSize),
    queryFn: async () => {
      const response = await Fuul.listUserReferralCodes({
        user_identifier: userIdentifier,
        user_identifier_type: UserIdentifierType.SolanaAddress,
        page,
        page_size: pageSize,
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
