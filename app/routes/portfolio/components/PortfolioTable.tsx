import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './PortfolioTable.module.css';
import Tabs from '~/components/Tabs/Tabs';
import BalancesTable from '~/components/Trade/BalancesTable/BalancesTable';
import DepositsWithdrawalsTable from '~/components/Trade/DepositsWithdrawalsTable/DepositsWithdrawalsTable';
import FilterDropdown from '~/components/Trade/FilterDropdown/FilterDropdown';
import FundingHistoryTable from '~/components/Trade/FundingHistoryTable/FundingHistoryTable';
import OpenOrdersTable from '~/components/Trade/OpenOrdersTable/OpenOrdersTable';
import OrderHistoryTable from '~/components/Trade/OrderHistoryTable/OrderHistoryTable';
import PositionsTable from '~/components/Trade/PositionsTable/PositionsTable';
import ToggleSwitch from '~/components/Trade/ToggleSwitch/ToggleSwitch';
import TradeHistoryTable from '~/components/Trade/TradeHistoryTable/TradeHistoryTable';
import TwapTable from '~/components/Trade/TwapTable/TwapTable';

export interface FilterOption {
    id: string;
    label: string;
}
interface propsIF {
    initialTab?: string;
}

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

const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'long', label: 'Long' },
    { id: 'short', label: 'Short' },
];

export default function PortfolioTable(props: propsIF) {
    const { initialTab = 'Balances' } = props;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [hideSmallBalances, setHideSmallBalances] = useState(false);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleFilterChange = (selectedId: string) => {
        setSelectedFilter(selectedId);
    };

    const handleToggleSmallBalances = (newState?: boolean) => {
        const newValue = newState !== undefined ? newState : !hideSmallBalances;
        setHideSmallBalances(newValue);
    };

    const rightAlignedContent = (
        <div className={styles.tableControls}>
            {' '}
            <FilterDropdown
                options={filterOptions}
                selectedOption={selectedFilter}
                onChange={handleFilterChange}
            />
            {activeTab === 'Balances' && (
                <ToggleSwitch
                    isOn={hideSmallBalances}
                    onToggle={handleToggleSmallBalances}
                />
            )}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Balances':
                return <BalancesTable />;
            case 'Positions':
                return <PositionsTable />;
            case 'Open Orders':
                return <OpenOrdersTable selectedFilter={selectedFilter} />;
            case 'TWAP':
                return <TwapTable />;
            case 'Trade History':
                return <TradeHistoryTable />;
            case 'Funding History':
                return <FundingHistoryTable />;
            case 'Order History':
                return <OrderHistoryTable selectedFilter={selectedFilter} />;
            case 'Deposits and Withdrawals':
                return <DepositsWithdrawalsTable />;
            default:
                return (
                    <div className={styles.emptyState}>
                        Select a tab to view data
                    </div>
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
