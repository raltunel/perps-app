import { useMemo, useState, useCallback, useEffect } from 'react';
import styles from './LiquidationsChartSection.module.css';
import Tabs from '~/components/Tabs/Tabs';
import LiquidationsChart from './LiqChar';
import { useOrderBookStore } from '~/stores/OrderBookStore';

interface LiquidationsChartSectionProps {
    symbol: string;
    mobileView?: boolean;
    mobileContent?: 'orderBook' | 'recentTrades';
}

const LiquidationsChartSection: React.FC<
    LiquidationsChartSectionProps
> = () => {
    const { buys, sells } = useOrderBookStore();

    const liquidationsChartTabs = useMemo(() => ['Distribution', 'Feed'], []);
    const [activeTab, setActiveTab] = useState(liquidationsChartTabs[0]);

    const handleTabChange = useCallback((tab: string) => setActiveTab(tab), []);

    const renderTabContent = useCallback(() => {
        if (activeTab === 'Distribution')
            return <LiquidationsChart buyData={buys} sellData={sells} />;
        return <div>Feed</div>;
    }, [activeTab, buys, sells]);

    const liqChartTabsComponent = (
        <div className={styles.liqChartTabContainer}>
            <Tabs
                wrapperId='liquidationsChartTabs'
                tabs={liquidationsChartTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                wide
                flex
            />
            <div className={styles.tabContent}>{renderTabContent()}</div>
        </div>
    );

    return (
        <div className={styles.liqChartSectionContainer}>
            {liqChartTabsComponent}
        </div>
    );
};

export default LiquidationsChartSection;
