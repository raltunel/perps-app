import { useQuery } from "@tanstack/react-query";
import { Fuul, UserIdentifierType } from "@fuul/sdk";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const affiliateStatsKeys = {
  all: ["affiliate-stats"] as const,
  stats: (userIdentifier: string) =>
    [...affiliateStatsKeys.all, userIdentifier] as const,
};

function getDateRange30Days() {
  const to = dayjs.utc().toISOString();
  const from = dayjs.utc().subtract(30, "day").startOf("day").toISOString();
  return { from, to };
}

export const useAffiliateStats = (userIdentifier: string, enabled = true) => {
  return useQuery({
    queryKey: affiliateStatsKeys.stats(userIdentifier),
    queryFn: async () => {
      const [stats, newTradersData, activeTradersData] = await Promise.all([
        Fuul.getAffiliateStats({
          user_identifier: userIdentifier,
          user_identifier_type: UserIdentifierType.SolanaAddress,
        }),
        Fuul.getAffiliateNewTraders({
          user_identifier: userIdentifier,
        }),
        Fuul.getAffiliateNewTraders({
          user_identifier: userIdentifier,
          ...getDateRange30Days(),
        }),
      ]);

      const newTraders =
        newTradersData.length > 0
          ? parseInt(newTradersData[0].total_new_traders, 10) || 0
          : 0;

      const activeTraders =
        activeTradersData.length > 0
          ? parseInt(activeTradersData[0].total_new_traders, 10) || 0
          : 0;

      return {
        ...stats,
        newTraders,
        activeTraders,
        isRegistered: true,
      };
    },
    enabled: enabled && !!userIdentifier,
    staleTime: 30000,
    gcTime: 300000,
    refetchInterval: 30000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
