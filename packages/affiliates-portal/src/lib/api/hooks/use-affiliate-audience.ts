import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";

export const affiliateAudienceKeys = {
  all: ["affiliate-audience"] as const,
  check: (userIdentifier: string) =>
    [...affiliateAudienceKeys.all, userIdentifier] as const,
};

export const useAffiliateAudience = (
  userIdentifier: string,
  enabled = true
) => {
  return useQuery({
    queryKey: affiliateAudienceKeys.check(userIdentifier),
    queryFn: async () => {
      const audiences = await Fuul.getUserAudiences({
        user_identifier: userIdentifier,
        user_identifier_type: UserIdentifierType.SolanaAddress,
      });

      const isAffiliateAccepted = (audiences.results?.length ?? 0) > 0;

      return {
        audiences,
        isAffiliateAccepted,
      };
    },
    enabled: enabled && !!userIdentifier,
    staleTime: 60000,
    gcTime: 300000,
  });
};
