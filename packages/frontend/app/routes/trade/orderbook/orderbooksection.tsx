import { useEffect, useMemo, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import BasicMenu from '~/components/BasicMenu/BasicMenu';
import Tabs from '~/components/Tabs/Tabs';
import { useAppSettings } from '~/stores/AppSettingsStore';
import OrderBook from './orderbook';
import styles from './orderbooksection.module.css';
import OrderBookTrades from './orderbooktrades';
interface OrderBookSectionProps {
    symbol: string;
}

const OrderBookSection: React.FC<OrderBookSectionProps> = ({ symbol }) => {
    const [orderCount, setOrderCount] = useState(9);
    const [tradesCount, setTradesCount] = useState(25);
    const orderCountForStacked = useMemo(() => {
        return Math.ceil(orderCount / 2);
    }, [orderCount]);

    const orderBookComponent = useMemo(
        () => <OrderBook symbol={symbol} orderCount={orderCount} />,
        [orderCount, symbol],
    );
    const orderBookTrades = useMemo(
        () => <OrderBookTrades symbol={symbol} tradesCount={tradesCount} />,
        [tradesCount, symbol],
    );
    const { orderBookMode, setOrderBookMode } = useAppSettings();
    const orderBookModeRef = useRef(orderBookMode);

    const calculateOrderCount = () => {
        const orderBookSection = document.getElementById('orderBookSection');

        if (orderBookSection) {
            let availableHeight =
                orderBookSection.getBoundingClientRect().height;
            if (
                window.innerHeight / availableHeight < 1.5 &&
                window.innerHeight < 1000
            ) {
                availableHeight = window.innerHeight / 1.5;
            }
            if (availableHeight > 0) {
                if (orderBookModeRef.current !== 'stacked') {
                    let otherHeightSum =
                        document
                            .getElementById('orderBookTabs')
                            ?.getBoundingClientRect()?.height || 0;
                    otherHeightSum +=
                        document
                            .getElementById('orderBookHeader1')
                            ?.getBoundingClientRect()?.height || 0;
                    otherHeightSum +=
                        document
                            .getElementById('orderBookHeader2')
                            ?.getBoundingClientRect()?.height || 0;
                    otherHeightSum +=
                        document
                            .getElementById('orderBookMidHeader')
                            ?.getBoundingClientRect()?.height || 0;
                    const orderCount = Math.floor(
                        (availableHeight - otherHeightSum) / 49,
                    );
                    setOrderCount(orderCount);
                    setTradesCount(Math.floor(availableHeight / 21));
                } else {
                    const orderCount = Math.floor(availableHeight / 1000);
                    setOrderCount(orderCount);
                }
            }

            // const watchlistSection = document.getElementById('watchlistSection');
            // const symbolInfoSection = document.getElementById('symbolInfoSection');
            // const tradeModulesSection = document.getElementById('tradeModulesSection');
            // const chartSection = document.getElementById('chartSection');

            // if(watchlistSection && symbolInfoSection && chartSection && tradeModulesSection){
            //     const modulesHeight = 16 + watchlistSection.getBoundingClientRect().height + symbolInfoSection.getBoundingClientRect().height + chartSection.getBoundingClientRect().height;
            //     orderBookSection.style.height = `${modulesHeight}px`;
            //     tradeModulesSection.style.height = `${modulesHeight}px`;
            // }
        }
    };

    useEffect(() => {
        window.addEventListener('resize', () => {
            setTimeout(() => {
                calculateOrderCount();
            }, 50);
        });

        calculateOrderCount();
    }, []);

    const menuItems = [
        {
            label: 'Tab',
            listener: () => {
                setOrderBookMode('tab');
            },
        },
        {
            label: 'Stacked',
            listener: () => {
                setOrderBookMode('stacked');
            },
        },
        {
            label: 'Large',
            listener: () => {
                setOrderBookMode('large');
            },
        },
    ];

    // Available tabs for the order book section
    const orderBookTabs = ['Book', 'Trades'];
    const [activeTab, setActiveTab] = useState<string>(orderBookTabs[0]);
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Book':
                return orderBookComponent;
            case 'Trades':
                return orderBookTrades;

            default:
                return orderBookComponent;
        }
    };

    const stackedOrderBook = (
        <div className={styles.orderBookSection}>
            <div className={styles.stackedContainer}>
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>Book</div>
                    <BasicMenu items={menuItems} icon={<BsThreeDots />} />
                </div>
                <OrderBook symbol={symbol} orderCount={orderCountForStacked} />
                <div className={styles.sectionHeader}>
                    <div className={styles.sectionHeaderTitle}>Trades</div>
                    <BasicMenu items={menuItems} icon={<BsThreeDots />} />
                </div>
                {orderBookTrades}
            </div>
        </div>
    );

    const largeOrderBook = (
        <div className={styles.orderBookSection}>
            <div className={styles.largeContainer}>
                <div className={styles.childOfLargeContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionHeaderTitle}>Book</div>
                    </div>
                    <OrderBook symbol={symbol} orderCount={orderCount} />
                </div>
                <div className={styles.childOfLargeContainer}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionHeaderTitle}>Trades</div>
                        <BasicMenu items={menuItems} icon={<BsThreeDots />} />
                    </div>
                    {orderBookTrades}
                </div>
            </div>
        </div>
    );

    const menuContent = (
        <div className={styles.menuContent}>
            <BasicMenu items={menuItems} icon={<BsThreeDots />} />
        </div>
    );
    const orderBookTabsComponent = (
        <div className={styles.orderBookSectionContainer}>
            <Tabs
                wrapperId='orderBookTabs'
                tabs={orderBookTabs}
                defaultTab={activeTab}
                onTabChange={handleTabChange}
                rightContent={menuContent}
                wide={true}
                flex={true}
            />
            <div className={styles.tabContent}>{renderTabContent()}</div>
        </div>
    );
    // const renderByMode = () => {
    //     switch (orderBookMode) {
    //         case 'tab':
    //             return orderBookTabsComponent;
    //         case 'stacked':
    //             return stackedOrderBook;
    //         case 'large':
    //             return largeOrderBook;
    //         default:
    //             return orderBookTabsComponent;
    //     }
    // };

    return (
        <>
            {orderBookMode === 'tab' && orderBookTabsComponent}
            {orderBookMode === 'stacked' && stackedOrderBook}
            {orderBookMode === 'large' && largeOrderBook}
        </>
    );
};
export default OrderBookSection;
