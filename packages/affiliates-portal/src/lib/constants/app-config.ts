/**
 * Centralized application configuration
 * Update these values when deploying for a different project
 */

export const APP_CONFIG = {
  /** Base URL for the main application */
  appUrl: "https://app.ambient.finance",

  /** Social media links */
  social: {
    telegram: "https://t.me/ambient_finance",
    twitter: "https://x.com/ambient_finance",
  },

  /** Pre-defined text templates */
  texts: {
    shareMessage:
      "Join me on Ambient Finance and start trading! Use my referral link to get started:",
  },

  /** Branding configuration */
  branding: {
    appName: "Ambient Finance",
  },
} as const;

/** Helper to build referral URL with a code */
export function buildReferralUrl(code: string): string {
  return `${APP_CONFIG.appUrl}?ref=${code}`;
}
