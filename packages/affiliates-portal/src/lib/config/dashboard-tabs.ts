import { DashboardTab, type DashboardTabConfig } from '@/components/tabs';

/**
 * Dashboard Tabs Configuration
 *
 * Defines the available tabs and their display properties.
 * Order in this array determines the display order in the UI.
 */
export const DASHBOARD_TAB_CONFIGS: DashboardTabConfig[] = [
  {
    value: DashboardTab.ReferredUsers,
    label: 'Affiliate History',
  },
  {
    value: DashboardTab.Links,
    label: 'Links',
  },
  {
    value: DashboardTab.CommissionActivity,
    label: 'Commission Activity',
  },
  {
    value: DashboardTab.Resources,
    label: 'Resources',
  },
];
