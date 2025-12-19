import type { Metadata } from 'next';
import { Lexend_Deca, Lexend_Exa } from 'next/font/google';
import './globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import './wallet-adapter.css';
import { SolanaProvider } from '@/components/providers/solana-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { FuulProvider } from '@/components/providers/fuul-provider';
import { ToasterProvider } from '@/components/providers/toaster-provider';
import { PoweredByBadge } from '@/components/common/powered-by-badge';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
});

const lexendExa = Lexend_Exa({
  subsets: ['latin'],
  variable: '--font-lexend-exa',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://affiliates.ambient.finance'),
  title: {
    default: 'Ambient Affiliates',
    template: '%s | Ambient Affiliates',
  },
  description: 'Join the Ambient Finance affiliate program. Earn commissions by referring traders to the leading decentralized exchange.',
  keywords: ['Ambient', 'DeFi', 'affiliate', 'referral', 'crypto', 'trading', 'decentralized exchange'],
  authors: [{ name: 'Ambient Finance' }],
  creator: 'Ambient Finance',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://affiliates.ambient.finance',
    siteName: 'Ambient Affiliates',
    title: 'Ambient Affiliates',
    description: 'Join the Ambient Finance affiliate program. Earn commissions by referring traders.',
    images: [
      {
        url: '/ambient_icon_x512.png',
        width: 512,
        height: 512,
        alt: 'Ambient Finance',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Ambient Affiliates',
    description: 'Join the Ambient Finance affiliate program. Earn commissions by referring traders.',
    images: ['/ambient_icon_x512.png'],
    creator: '@ambient_finance',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} ${lexendExa.variable} font-sans`}>
        <FuulProvider>
          <QueryProvider>
            <SolanaProvider>{children}</SolanaProvider>
          </QueryProvider>
        </FuulProvider>
        <ToasterProvider />
        <PoweredByBadge />
      </body>
    </html>
  );
}
