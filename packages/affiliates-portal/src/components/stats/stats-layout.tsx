import { ReactNode } from 'react';

interface StatsLayoutProps {
  feesEarnedCard: ReactNode;
  allTimeRankCard: ReactNode;
  rebateRateCard: ReactNode;
  tradingVolumeCard: ReactNode;
  newTradersCard: ReactNode;
  inviteesCard: ReactNode;
  currentLevelCard: ReactNode;
}

export function StatsLayout({
  feesEarnedCard,
  allTimeRankCard,
  rebateRateCard,
  tradingVolumeCard,
  newTradersCard,
  inviteesCard,
  currentLevelCard,
}: StatsLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="flex">{feesEarnedCard}</div>
          <div className="flex">{rebateRateCard}</div>
          <div className="flex">{allTimeRankCard}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="flex">{tradingVolumeCard}</div>
          <div className="flex">{newTradersCard}</div>
          <div className="flex">{inviteesCard}</div>
        </div>
      </div>

      <div className="lg:col-span-5 flex h-full">{currentLevelCard}</div>
    </div>
  );
}
