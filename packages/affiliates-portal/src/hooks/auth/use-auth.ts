"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export interface UseAuthReturn {
  isConnected: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  walletAddress: string | null;
  connectWallet: () => void;
}

export function useAuth(): UseAuthReturn {
  const { connected, connecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [isInitializing, setIsInitializing] = useState(true);
  const hasAttemptedAutoConnect = useRef(false);

  useEffect(() => {
    if (connecting) {
      hasAttemptedAutoConnect.current = true;
    }

    if (connected || (hasAttemptedAutoConnect.current && !connecting)) {
      setIsInitializing(false);
    }
  }, [connected, connecting]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInitializing && !connecting) {
        setIsInitializing(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isInitializing, connecting]);

  const connectWallet = () => {
    setVisible(true);
  };

  return {
    isConnected: connected,
    isLoading: connecting,
    isInitializing,
    walletAddress: publicKey?.toBase58() || null,
    connectWallet,
  };
}
