import { ReactNode } from 'react';

interface StatsLayoutNotRegisteredProps {
  notRegisteredCard: ReactNode;
  currentLevelCard: ReactNode;
}

export function StatsLayoutNotRegistered({
  notRegisteredCard,
  currentLevelCard,
}: StatsLayoutNotRegisteredProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column - Not registered message - 7 parts */}
      <div className="lg:col-span-7 flex">
        {notRegisteredCard}
      </div>

      {/* Right column - Current Level Card - 5 parts */}
      <div className="lg:col-span-5 flex h-full">{currentLevelCard}</div>
    </div>
  );
}
