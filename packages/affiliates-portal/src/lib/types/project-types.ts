/**
 * Theme Type Definitions (Static Theme Version)
 *
 * Simplified types for static theme implementation.
 * Only includes essential theme-related types.
 */

export type BackgroundVariant = 'solid' | 'gradient-linear' | 'gradient-mirrored';

export interface ProjectCustomizationTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundSecondary?: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    radius: string;
  };
  backgroundVariant?: BackgroundVariant;
  typography: {
    fontFamily: string;
    headingFontFamily?: string;
  };
  layout: {
    maxWidth: string;
    spacing: string;
  };
}

/**
 * Default theme configuration
 * Use this as reference for customizing your theme
 */
export const DEFAULT_THEME: ProjectCustomizationTheme = {
  colors: {
    primary: 'hsl(262.1 83.3% 57.8%)',        // Purple
    secondary: 'hsl(220 14.3% 95.9%)',        // Light gray
    background: 'hsl(0 0% 100%)',             // White
    foreground: 'hsl(224 71.4% 4.1%)',        // Dark blue
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(224 71.4% 4.1%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(224 71.4% 4.1%)',
    muted: 'hsl(220 14.3% 95.9%)',
    mutedForeground: 'hsl(220 8.9% 46.1%)',
    accent: 'hsl(220 14.3% 95.9%)',
    accentForeground: 'hsl(220 8.9% 46.1%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 20% 98%)',
    border: 'hsl(220 13% 91%)',
    input: 'hsl(220 13% 91%)',
    ring: 'hsl(262.1 83.3% 57.8%)',
    radius: '0.5rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  layout: {
    maxWidth: '1200px',
    spacing: '0.25rem',
  },
};
