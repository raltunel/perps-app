import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function Tab(props: TabProps) {
  const { label, isActive, onClick } = props;
  
  return (
    <button
      className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
      onClick={onClick}
    >
      {label}
      {isActive && (
        <motion.div
          className={styles.activeIndicator}
          layoutId="activeIndicator"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}

export interface TabsProps {
  tabs: string[];
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  rightContent?: React.ReactNode;
}

export default function Tabs(props: TabsProps) {
  const { tabs, defaultTab, onTabChange, rightContent } = props;
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };
  
  // Check if the tabs can be scrolled
  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      
      // Can scroll left if we're not at the beginning
      setCanScrollLeft(scrollLeft > 1);
      
      // Can scroll right if we're not at the end
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };
  
  // Scroll the active tab into view when active tab changes
  useEffect(() => {
    if (tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`.${styles.activeTab}`);
      if (activeTabElement) {
        // Calculate the scroll position to center the tab
        const tabsList = tabsListRef.current;
        const tabsListWidth = tabsList.offsetWidth;
        const activeTabWidth = (activeTabElement as HTMLElement).offsetWidth;
        const activeTabLeft = (activeTabElement as HTMLElement).offsetLeft;
        
        const scrollPosition = activeTabLeft - (tabsListWidth / 2) + (activeTabWidth / 2);
        
        tabsList.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth'
        });
        
        // Check scroll state after scrolling
        setTimeout(checkScroll, 350); // Delay for smooth scroll animation
      }
    }
  }, [activeTab]);
  
  // Check scroll state on mount and when window resizes
  useEffect(() => {
    checkScroll();
    
    const handleResize = () => {
      checkScroll();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initialize scroll state
    if (tabsListRef.current) {
      tabsListRef.current.addEventListener('scroll', checkScroll);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (tabsListRef.current) {
        tabsListRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);
  
  const scrollLeft = () => {
    if (tabsListRef.current) {
      const { clientWidth } = tabsListRef.current;
      // Scroll half the width of the container
      tabsListRef.current.scrollBy({
        left: -clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };
  
  const scrollRight = () => {
    if (tabsListRef.current) {
      const { clientWidth } = tabsListRef.current;
      // Scroll half the width of the container
      tabsListRef.current.scrollBy({
        left: clientWidth / 2,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.tabsContainer}>
      <div 
        className={`${styles.tabsWrapper} ${canScrollLeft ? styles.showLeftFade : ''} ${canScrollRight ? styles.showRightFade : ''}`}
        ref={tabsWrapperRef}
      >
        {/* Left scroll arrow */}
        {canScrollLeft && (
          <button 
            className={`${styles.scrollArrow} ${styles.scrollArrowLeft}`}
            onClick={scrollLeft}
            aria-label="Scroll tabs left"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
        )}
        
        {/* Tabs list */}
        <div 
          className={styles.tabsList} 
          ref={tabsListRef}
          onScroll={checkScroll}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => handleTabClick(tab)}
            />
          ))}
        </div>
        
        {/* Right scroll arrow */}
        {canScrollRight && (
          <button 
            className={`${styles.scrollArrow} ${styles.scrollArrowRight}`}
            onClick={scrollRight}
            aria-label="Scroll tabs right"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        )}
      </div>
      
      {rightContent && (
        <div className={styles.rightContent}>
          {rightContent}
        </div>
      )}
    </div>
  );
}