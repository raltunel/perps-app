import { useState } from 'react';
import styles from './TwapTable.module.css';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';
import HistoryTwapTable from './HistoryTwapTable/HistoryTwapTable';
import FillTwapTable from './FillTwapTable/FillTwapTable';
import ActiveTwapTable from './ActiveTwapTable/ActiveTwapTable';

interface Props {
    initialTab?: string;
}

const availableTabs = ['Active', 'History', 'Fill History'];
export default function TwapTable(props: Props) {
    const { initialTab = 'Active' } = props;
    const [activeTab, setActiveTab] = useState(initialTab);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Active':
                return <ActiveTwapTable />;

            case 'History':
                return <HistoryTwapTable />;
            case 'Open Orders':
                return (
                    <div className={styles.emptyState}>
                        TWAP data will appear here
                    </div>
                );
            case 'Fill History':
                return <FillTwapTable />;

            default:
                return <ActiveTwapTable />;
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <Tabs
                tabs={availableTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
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
