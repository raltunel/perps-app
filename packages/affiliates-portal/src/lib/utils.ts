import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BackgroundVariant } from "./types/project-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates CSS background gradient styles based on variant type
 * @param backgroundVariant - The type of background gradient ('solid' | 'gradient-linear' | 'gradient-mirrored')
 * @param backgroundColor - Primary background color
 * @param backgroundSecondaryColor - Secondary color for gradient
 * @returns CSS background style string
 */
export function getBackgroundGradientStyles(
  backgroundVariant: BackgroundVariant,
  backgroundColor: string,
  backgroundSecondaryColor: string
): string {
  switch (backgroundVariant) {
    case "gradient-linear":
      return `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundSecondaryColor} 100%)`;
    case "gradient-mirrored":
      return `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundSecondaryColor} 50%, ${backgroundColor} 100%)`;
    default:
      return backgroundColor;
  }
}

/**
 * Determines the appropriate text color (black or white) based on background color lightness
 * @param color - HSL color string (e.g., 'hsl(262.1 83.3% 57.8%)')
 * @returns '#000000' for light backgrounds, '#ffffff' for dark backgrounds
 */
export function getTextColorForBackground(color: string): string {
  const match = color.match(/hsl\((\d+\.?\d*)\s+(\d+\.?\d*)%\s+(\d+\.?\d*)%\)/);
  if (!match) return "#ffffff";

  const lightness = parseFloat(match[3]);
  return lightness > 50 ? "#000000" : "#ffffff";
}

export function maskAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isEvmAddress(address: string): boolean {
  return address.startsWith("0x") && address.length === 42;
}

export function maskUserAddress(address: string): string {
  if (!address) return "";

  if (isEvmAddress(address)) {
    // EVM address: 0x1234...5678
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  } else {
    // Solana address: ABC1...XYZ9
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }
}
