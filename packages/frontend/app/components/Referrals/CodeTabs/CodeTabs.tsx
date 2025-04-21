import { useState } from 'react';
import styles from './CodeTabs.module.css';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';

interface Props {
    initialTab?: string;
}
const availableTabs = ['Enter Code', 'Create Code', 'Claim'];
export default function CodeTabs(props: Props) {
    const { initialTab = 'Enter Code' } = props;
    const [activeTab, setActiveTab] = useState(initialTab);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Enter Code':
                return <div>enter code</div>;
            case 'Create Code':
                return <div>enter code</div>;
            case 'Claim':
                return <div>enter code</div>;
            default:
                return (
                    <div className={styles.emptyState}>
                        Select a tab to view data
                    </div>
                );
        }
    };

    return (
        <div className={styles.tableWrapper}>
            <Tabs
                tabs={availableTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                wrapperId="codeTabs" 
                layoutIdPrefix="codeTabIndicator" 
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
