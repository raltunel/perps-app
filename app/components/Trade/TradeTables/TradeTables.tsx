import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './TradeTable.module.css';
import Tabs from '~/components/Tabs/Tabs';

interface TradeTableProps {
  initialTab?: string;
}

export default function TradeTable(props: TradeTableProps) {
  const { initialTab = 'Balances' } = props;
  const [activeTab, setActiveTab] = useState(initialTab);

  const availableTabs = [
    'Balances',
    'Positions',
    'Open Orders',
    'TWAP',
    'Trade History',
    'Funding History',
    'Order History',
    'Deposits and Withdrawals',
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const rightAlignedContent = (
    <div className={styles.tableControls}>Right side content</div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Balances':
        return (
          <div className={styles.emptyState}>
            Balances data will appear here
          </div>
        );

      case 'Positions':
        return (
          <div className={styles.emptyState}>
            Positions data will appear here
          </div>
        );
      case 'Open Orders':
        return (
          <div className={styles.emptyState}>
            Open Orders data will appear here
          </div>
        );
      case 'TWAP':
        return (
          <div className={styles.emptyState}>TWAP data will appear here</div>
        );
      case 'Trade History':
        return (
          <div className={styles.emptyState}>
            Trade History data will appear here
          </div>
        );
      case 'Funding History':
        return (
          <div className={styles.emptyState}>
            Funding History data will appear here
          </div>
        );
      case 'Order History':
        return (
          <div className={styles.emptyState}>
            Order History data will appear here
          </div>
        );
      case 'Deposits and Withdrawals':
        return (
          <div className={styles.emptyState}>
            Deposits and Withdrawals data will appear here
          </div>
        );
      default:
        return (
          <div className={styles.emptyState}>Select a tab to view data</div>
        );
    }
  };

  return (
    <div className={styles.tradeTableWrapper}>
      <Tabs
        tabs={availableTabs}
        defaultTab={activeTab}
        onTabChange={handleTabChange}
        rightContent={rightAlignedContent}
      />
          <motion.div
              className={styles.tableContent}
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
}
