"use client";

import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { WalletButton } from "@/components/wallet/wallet-button";
import { AnimatedBackground } from "@/components/common/animated-background";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {/* Fixed gradient background - Black to Violet (Ambient) */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #06060c 0%, #0d0d14 50%, #12101a 100%)",
        }}
      />
      {/* Violet accent glow from bottom */}
      <div
        className="fixed inset-0 -z-10 opacity-40"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, #7371fc 0%, transparent 50%)",
        }}
      />

      {/* Animated wire-like lines background */}
      <AnimatedBackground />

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border-hover bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/20">
          <div className="w-full px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Left side - Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/assets/logos/ambient_logo_large.svg"
                  alt="Ambient"
                  width={140}
                  height={27}
                  className="h-7 w-auto"
                  priority
                />
              </Link>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-4">
                <WalletButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - flex-1 to push footer to bottom */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="w-full border-t border-border-hover bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/20">
          <div className="w-full px-4">
            <div className="flex h-16 items-center justify-center"></div>
          </div>
        </footer>
      </div>
    </>
  );
}
