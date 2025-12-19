'use client';

import { Wallet } from 'lucide-react';
import { ConnectWalletButton } from './connect-wallet-button';

interface ConnectWalletCardProps {
  title?: string;
  description?: string;
}

export function ConnectWalletCard({
  title = 'Connect your wallet',
  description = 'Sign in to view your data and start earning rewards',
}: ConnectWalletCardProps) {
  return (
    <div className="bg-surface backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-border-default p-8 sm:p-12">
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
        <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center">
          <Wallet className="w-8 h-8 text-text-tertiary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-primary">{title}</h3>
          <p className="text-text-muted text-sm sm:text-base max-w-md">{description}</p>
        </div>

        <ConnectWalletButton size="lg" />
      </div>
    </div>
  );
}
