'use client';

import { useAuth } from '@/hooks/auth/use-auth';

interface ConnectWalletButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConnectWalletButton({
  size = 'md',
  className = '',
}: ConnectWalletButtonProps) {
  const { connectWallet } = useAuth();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5',
    lg: 'px-6 py-3',
  };

  return (
    <button
      onClick={connectWallet}
      className={`bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-300 cursor-pointer ${sizeClasses[size]} ${className}`}
    >
      Connect Wallet
    </button>
  );
}
