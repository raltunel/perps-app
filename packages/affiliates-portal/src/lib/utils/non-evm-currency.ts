export type SolanaAddress = string;

export interface NonEvmCurrencyData {
  name: string;
  chain: 'solana' | 'sui';
  address: string;
  decimals: number;
  logoURI: string;
  canBeUsedForDeposit?: boolean;
  canBeUsedForTransactionCurrency?: boolean;
  canBeUsedForReferredVolume?: boolean;
}

const solanaCurrencies: NonEvmCurrencyData[] = [
  {
    name: 'SOL',
    chain: 'solana',
    address: 'So11111111111111111111111111111111111111111',
    decimals: 9,
    logoURI: '/assets/webp/solana.webp',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
    canBeUsedForReferredVolume: true,
  },
  {
    name: 'USDC',
    chain: 'solana',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    logoURI: '/assets/svg/usdc.svg',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
    canBeUsedForReferredVolume: true,
  },
  {
    name: 'WETH',
    chain: 'solana',
    address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    decimals: 8,
    logoURI: '/assets/svg/ethereum.svg',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
  },
];

const suiCurrencies: NonEvmCurrencyData[] = [
  {
    name: 'USDC',
    chain: 'sui',
    address: '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
    decimals: 6,
    logoURI: '/assets/svg/usdc.svg',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
    canBeUsedForReferredVolume: true,
  },
  {
    name: 'SUI',
    chain: 'sui',
    address: '0x2::sui::SUI',
    decimals: 9,
    logoURI: '/assets/webp/sui.webp',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
    canBeUsedForReferredVolume: true,
  },
  {
    name: 'WETH',
    chain: 'sui',
    address: '0x94e7a8e71830d2b34b3edaa195dc24c45d142584f06fa257b73af753d766e690::celer_weth_coin::CELER_WETH_COIN',
    decimals: 9,
    logoURI: '/assets/svg/ethereum.svg',
    canBeUsedForDeposit: true,
    canBeUsedForTransactionCurrency: true,
  },
];

export const nonEvmCurrencyData: NonEvmCurrencyData[] = [...solanaCurrencies, ...suiCurrencies];

export const getNonEvmCurrenciesByChain = (chain: 'solana' | 'sui'): NonEvmCurrencyData[] => {
  return nonEvmCurrencyData.filter((currency) => currency.chain === chain);
};

export const getNonEvmCurrencySymbol = (address: string, chain: 'solana' | 'sui'): string => {
  const currency = nonEvmCurrencyData.find(
    (c) => c.address.toLowerCase() === address.toLowerCase() && c.chain === chain,
  );
  return currency?.name ?? address;
};

export const getNonEvmCurrencyDecimals = (address: string, chain: 'solana' | 'sui'): number => {
  const currency = nonEvmCurrencyData.find(
    (c) => c.address.toLowerCase() === address.toLowerCase() && c.chain === chain,
  );
  return currency?.decimals ?? 9;
};

export const getNonEvmCurrencyLogoURI = (address: string, chain: 'solana' | 'sui'): string => {
  const defaultLogoURI = chain === 'solana' ? '/assets/webp/solana.webp' : '/assets/webp/sui.webp';
  const currency = nonEvmCurrencyData.find(
    (c) => c.address.toLowerCase() === address.toLowerCase() && c.chain === chain,
  );
  return currency?.logoURI ?? defaultLogoURI;
};

export const getNonEvmCurrencyLogoByCurrencyName = (currencyName: string, chain: 'solana' | 'sui'): string => {
  const defaultLogoURI = chain === 'solana' ? '/assets/webp/solana.webp' : '/assets/webp/sui.webp';
  const currency = nonEvmCurrencyData.find((c) => c.name === currencyName && c.chain === chain);
  return currency?.logoURI ?? defaultLogoURI;
};

export const getNonEvmCurrenciesWithLogos = (
  chain: 'solana' | 'sui',
): { name: string; logoURI: string; address: string; decimals: number }[] => {
  return nonEvmCurrencyData
    .filter((currency) => currency.chain === chain && currency.logoURI)
    .map((currency) => ({
      name: currency.name,
      logoURI: currency.logoURI,
      address: currency.address,
      decimals: currency.decimals,
    }));
};

export const isValidSolanaAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

export const isValidSuiAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]+(::[a-zA-Z0-9_]+)+$/.test(address);
};

export const formatTokenAmount = (amountInWei: number, decimals: number): string => {
  const amount = amountInWei / Math.pow(10, decimals);

  if (amount % 1 === 0) {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  if (amount >= 1) {
    const formatted = amount.toFixed(2).replace(/\.?0+$/, '');
    const [whole, decimal] = formatted.split('.');
    const wholeFormatted = Number(whole).toLocaleString('en-US');
    return decimal ? `${wholeFormatted}.${decimal}` : wholeFormatted;
  }

  return amount.toFixed(4).replace(/\.?0+$/, '');
};
