import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";

export const userReferrerKeys = {
  all: ["user-referrer"] as const,
  byUser: (userIdentifier: string) =>
    [...userReferrerKeys.all, userIdentifier] as const,
};

export const useUserReferrer = (userIdentifier: string, enabled = true) => {
  return useQuery({
    queryKey: userReferrerKeys.byUser(userIdentifier),
    queryFn: async () => {
      const response = await Fuul.getUserReferrer({
        user_identifier: userIdentifier,
        user_identifier_type: UserIdentifierType.SolanaAddress,
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
