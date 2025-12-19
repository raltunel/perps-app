'use client';

import React from 'react';
import type { GenericTabContentProps, GenericTabValue } from './types';

/**
 * TabContent Component
 *
 * Renders the content for the currently selected tab.
 * Includes fade-in and slide-up animation when tab changes.
 *
 * @template T - The type of tab value (string or number)
 * @param selectedTab - Currently active tab value
 * @param tabContentMap - Map of tab values to their content components
 */
export function TabContent<T extends GenericTabValue>({
  selectedTab,
  tabContentMap,
}: GenericTabContentProps<T>) {
  const content = tabContentMap[String(selectedTab)];

  if (!content) {
    return null;
  }

  return (
    <div
      key={String(selectedTab)}
      className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
      role="tabpanel"
      aria-labelledby={`tab-${String(selectedTab)}`}
    >
      {content}
    </div>
  );
}
