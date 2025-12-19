import type React from 'react';

// Generic tab value type
export type GenericTabValue = string | number;

// Generic interface for tab configuration
export interface GenericTabConfig<T extends GenericTabValue> {
  value: T;
  label: string | React.ReactNode;
  badge?: {
    show: boolean;
    content?: string | number;
  };
}

// Generic interface for tab content mapping
export interface GenericTabContentMap {
  [key: string]: React.ReactNode;
}

// Generic props for the TabController component
export interface GenericTabControllerProps<T extends GenericTabValue> {
  selectedTab: T;
  onTabChange: (newValue: T) => void;
  tabConfigs: GenericTabConfig<T>[];
}

// Generic props for the TabContent component
export interface GenericTabContentProps<T extends GenericTabValue> {
  selectedTab: T;
  tabContentMap: GenericTabContentMap;
}

// Dashboard tab options enum for static theme
export enum DashboardTab {
  ReferredUsers = 'affiliate-history',
  Links = 'links',
  CommissionActivity = 'commission-activity',
  Resources = 'resources',
}

// Type aliases for dashboard tabs
export type DashboardTabConfig = GenericTabConfig<DashboardTab>;
export type DashboardTabContentMap = GenericTabContentMap;
export type DashboardTabControllerProps = GenericTabControllerProps<DashboardTab>;
export type DashboardTabContentProps = GenericTabContentProps<DashboardTab>;
