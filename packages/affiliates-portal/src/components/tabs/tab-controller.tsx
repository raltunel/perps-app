'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GenericTabControllerProps, GenericTabValue } from './types';

/**
 * TabController Component
 *
 * Renders a list of tab buttons with glassmorphism styling.
 * Handles tab selection and visual state.
 * Supports horizontal scrolling on mobile with chevron buttons.
 *
 * @template T - The type of tab value (string or number)
 * @param selectedTab - Currently active tab value
 * @param onTabChange - Callback when tab is clicked
 * @param tabConfigs - Array of tab configurations
 */
export function TabController<T extends GenericTabValue>({
  selectedTab,
  onTabChange,
  tabConfigs,
}: GenericTabControllerProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position and update arrow visibility
  const updateArrowVisibility = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Initial check
    updateArrowVisibility();

    // Listen to scroll events
    container.addEventListener('scroll', updateArrowVisibility);

    // Listen to window resize
    window.addEventListener('resize', updateArrowVisibility);

    return () => {
      container.removeEventListener('scroll', updateArrowVisibility);
      window.removeEventListener('resize', updateArrowVisibility);
    };
  }, [updateArrowVisibility]);

  // Don't render if no tabs are configured
  if (tabConfigs.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 200;
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative mb-6 sm:mb-8">
      {/* Left Arrow - Only visible on mobile when needed */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-surface-hover backdrop-blur-md rounded-full text-white hover:bg-surface-active transition-all md:hidden"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth md:flex-wrap"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {tabConfigs.map((config) => (
          <button
            key={String(config.value)}
            onClick={() => onTabChange(config.value)}
            className={`
              px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 relative whitespace-nowrap flex-shrink-0 cursor-pointer
              ${
                selectedTab === config.value
                  ? 'bg-surface-active text-white backdrop-blur-md shadow-lg'
                  : 'text-text-tertiary hover:text-white hover:bg-surface-hover backdrop-blur-sm'
              }
            `}
            aria-selected={selectedTab === config.value}
            role="tab"
          >
            {config.label}
            {config.badge?.show && (
              <span
                className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"
                aria-label="notification badge"
              />
            )}
          </button>
        ))}
      </div>

      {/* Right Arrow - Only visible on mobile when needed */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-surface-hover backdrop-blur-md rounded-full text-white hover:bg-surface-active transition-all md:hidden"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
