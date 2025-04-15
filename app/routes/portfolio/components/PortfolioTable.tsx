import { useState } from 'react';
import styles from './PortfolioTable.module.css';
import { motion } from 'framer-motion';
import Tabs from '~/components/Tabs/Tabs';
import FilterDropdown from '~/components/Trade/FilterDropdown/FilterDropdown';
import ToggleSwitch from '~/components/Trade/ToggleSwitch/ToggleSwitch';
import MasterAccount from './MasterAccount';

export interface FilterOption {
    id: string;
    label: string;
}
interface propsIF {
    initialTab?: string;
}

const availableTabs = ['Master Account'];

type availableTabsT = (typeof availableTabs)[number];

const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'long', label: 'Long' },
    { id: 'short', label: 'Short' },
];

export default function PortfolioTable(props: propsIF) {
    const { initialTab = availableTabs[0] } = props;

    // this controls which tab is active in the DOM
    const [activeTab, setActiveTab] = useState<availableTabsT>(initialTab);

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
        <div className={styles.table_controls}>
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
            case 'Master Account':
                return <MasterAccount />;
            default:
                return (
                    <div className={styles.emptyState}>
                        Select a tab to view data
                    </div>
                );
        }
    };

    return (
        <div className={styles.table_wrapper}>
            <Tabs
                tabs={availableTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                rightContent={rightAlignedContent}
            />
            <motion.div
                className={styles.table_content}
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
