import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import SkeletonNode from '~/components/Skeletons/SkeletonNode/SkeletonNode';
import Tabs from '~/components/Tabs/Tabs';
import { useDebugStore } from '~/stores/DebugStore';
import { LiqChartTabType, useLiqChartStore } from '~/stores/LiqChartStore';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { TableState } from '~/utils/CommonIFs';
import type {
    OrderBookRowIF,
    OrderRowResolutionIF,
} from '~/utils/orderbook/OrderBookIFs';
import {
    createRandomOrderBookLiq,
    getResolutionListForSymbol,
    interpolateOrderBookData,
} from '~/utils/orderbook/OrderBookUtils';
import LiquidationsChart from './LiquidationOBChart';
import styles from './LiquidationsChartSection.module.css';
import OBLiqFetcher from './ObLiqFetcher';
import { useLiquidationStore } from '~/stores/LiquidationStore';

interface LiquidationsChartSectionProps {
    symbol: string;
    mobileView?: boolean;
    mobileContent?: 'orderBook' | 'recentTrades';
}

const LiquidationsChartSection: React.FC<LiquidationsChartSectionProps> = ({
    symbol,
}) => {
    const {
        buys,
        sells,
        inpBuys,
        inpSells,
        setInpBuys,
        setInpSells,
        selectedResolution,
        selectedMode,
        setSelectedResolution,
        setSelectedMode,
        liqBuys,
        liqSells,
        setLiqBuys,
        setLiqSells,
        orderCount,
        activeOrderTab,
        obMaxSell,
        obMinBuy,
    } = useOrderBookStore();
    const { symbolInfo } = useTradeDataStore();
    const { loadingState } = useLiquidationStore();

    const [resolutions, setResolutions] = useState<OrderRowResolutionIF[]>([]);
    const tabContentRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const { activeTab, setActiveTab } = useLiqChartStore();

    const [chartMode, setChartMode] = useState<'distribution' | 'cumulative'>(
        'distribution',
    );

    const buysRef = useRef<OrderBookRowIF[]>([]);
    const sellsRef = useRef<OrderBookRowIF[]>([]);
    buysRef.current = buys;
    sellsRef.current = sells;

    const { buyLiqs, sellLiqs } = useLiquidationStore();

    const buyLiqsFilteredOB = useMemo(() => {
        return buyLiqs.filter((liq) => liq.px >= obMinBuy);
    }, [buyLiqs, obMinBuy]);

    const sellLiqsFilteredOB = useMemo(() => {
        return sellLiqs.filter((liq) => liq.px <= obMaxSell);
    }, [sellLiqs, obMaxSell]);

    const handleTabChange = useCallback(
        (tab: LiqChartTabType) => setActiveTab(tab),
        [setActiveTab],
    );
    const { pauseLiqAnimation } = useDebugStore();
    const pauseLiqAnimationRef = useRef(pauseLiqAnimation);
    pauseLiqAnimationRef.current = pauseLiqAnimation;

    const genRandomData = useCallback(() => {
        if (
            buysRef.current.length === 0 ||
            sellsRef.current.length === 0 ||
            pauseLiqAnimationRef.current
        )
            return;
        const inpBuys = interpolateOrderBookData(
            buysRef.current.slice(0, orderCount),
            sellsRef.current[0].px,
        );
        const inpSells = interpolateOrderBookData(
            sellsRef.current.slice(0, orderCount),
            buysRef.current[0].px,
        );
        setInpBuys(inpBuys);
        setInpSells(inpSells);
        const { liqBuys, liqSells } = createRandomOrderBookLiq(
            buysRef.current.slice(0, orderCount),
            sellsRef.current.slice(0, orderCount),
        );
        setLiqBuys(liqBuys);
        setLiqSells(liqSells.reverse());
    }, [setInpBuys, setInpSells, setLiqBuys, setLiqSells, orderCount]);

    useEffect(() => {
        genRandomData();
        const randomDataInterval = setInterval(() => {
            genRandomData();
        }, 1000);

        return () => clearInterval(randomDataInterval);
    }, [orderCount, genRandomData]);

    useEffect(() => {
        if (symbol === symbolInfo?.coin) {
            const resolutionList = getResolutionListForSymbol(symbolInfo);
            setResolutions(resolutionList);
            if (!selectedResolution) {
                setSelectedResolution(resolutionList[0]);
            }
        }
    }, [symbol, symbolInfo?.coin, selectedResolution, setSelectedResolution]);

    useEffect(() => {
        const updateDimensions = () => {
            setTimeout(() => {
                if (tabContentRef.current) {
                    const rect = tabContentRef.current.getBoundingClientRect();
                    let height = rect.height;
                    const slotsWrapper = document.getElementById(
                        'orderBookSlotsWrapper',
                    );

                    if (slotsWrapper) {
                        const slotsWrapperHeight =
                            slotsWrapper.getBoundingClientRect().height;
                        height = slotsWrapperHeight;
                    }

                    setDimensions({ width: rect.width, height: height });
                }
            }, 200);
        };

        window.addEventListener('resize', updateDimensions);

        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, [orderCount, loadingState]);

    const inpOrderCount = useMemo(() => {
        if (!inpBuys.length) return 30;
        return inpBuys.length;
    }, [inpBuys]);

    const getRandWidth = useCallback(
        (index: number, inverse: boolean = false) => {
            let rand;
            if (inverse) {
                rand =
                    100 / inpOrderCount +
                    index * (100 / inpOrderCount) +
                    Math.random() * 20;
            } else {
                rand = 100 - index * (100 / inpOrderCount) + Math.random() * 20;
            }
            return rand < 100 ? rand + '%' : '100%';
        },
        [inpOrderCount],
    );

    const renderTabContent = useCallback(() => {
        if (activeTab === 'Distribution') {
            if (loadingState === TableState.LOADING) {
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            gap: '4px',
                        }}
                    >
                        {Array.from({ length: inpOrderCount }).map(
                            (_, index) => (
                                <SkeletonNode
                                    width={getRandWidth(index)}
                                    height='16px'
                                />
                            ),
                        )}
                        {Array.from({ length: inpOrderCount }).map(
                            (_, index) => (
                                <SkeletonNode
                                    width={getRandWidth(index, true)}
                                    height='16px'
                                />
                            ),
                        )}
                    </motion.div>
                );
            }

            if (loadingState === TableState.FILLED) {
                const hasBuyData = buyLiqsFilteredOB.length > 0;
                const hasSellData = sellLiqsFilteredOB.length > 0;

                // Both empty - show full empty state
                if (!hasBuyData && !hasSellData) {
                    return (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className={styles.chartWrapper}
                        >
                            <div className={styles.emptyStateCenter}>
                                <span>No liquidation data available</span>
                            </div>
                        </motion.div>
                    );
                }

                return (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className={styles.chartWrapper}
                    >
                        <LiquidationsChart
                            buyData={buyLiqsFilteredOB}
                            sellData={sellLiqsFilteredOB}
                            liqBuys={[]}
                            liqSells={[]}
                            width={dimensions.width}
                            height={dimensions.height}
                            location={'obBook'}
                            chartMode={chartMode}
                        />
                        <button
                            className={styles.modeButton}
                            onClick={() =>
                                setChartMode(
                                    chartMode === 'distribution'
                                        ? 'cumulative'
                                        : 'distribution',
                                )
                            }
                        >
                            {chartMode === 'distribution'
                                ? 'Distribution'
                                : 'Cumulative'}
                        </button>
                    </motion.div>
                );
            }
        }
        return <div>Feed</div>;
    }, [
        activeTab,
        buyLiqsFilteredOB,
        sellLiqsFilteredOB,
        dimensions,
        loadingState,
        chartMode,
    ]);

    const liqChartTabsComponent = (
        <div className={styles.liqChartTabContainer}>
            <Tabs
                wrapperId='liquidationsChartTabs'
                tabs={Object.values(LiqChartTabType).map((tab) =>
                    tab.toString(),
                )}
                defaultTab={activeTab}
                onTabChange={(tab) => handleTabChange(tab as LiqChartTabType)}
                wide
                flex
            />
            <div className={styles.liqChartControls}>
                <ComboBox
                    value={selectedResolution?.val}
                    options={resolutions}
                    fieldName='val'
                    onChange={(value) => {
                        const resolution = resolutions.find(
                            (resolution) => resolution.val === Number(value),
                        );
                        if (resolution) {
                            setSelectedResolution(resolution);
                        }
                    }}
                />
                <ComboBox
                    value={
                        selectedMode === 'symbol' ? symbol.toUpperCase() : 'USD'
                    }
                    options={[symbol.toUpperCase(), 'USD']}
                    onChange={(value) =>
                        setSelectedMode(
                            value === symbol.toUpperCase() ? 'symbol' : 'usd',
                        )
                    }
                />
            </div>
            <div ref={tabContentRef} className={styles.tabContent}>
                {(activeOrderTab.includes('book') ||
                    activeOrderTab === 'Book') && (
                    <div className={styles.startGap}>Liquidation Chart</div>
                )}
                {renderTabContent()}
            </div>
        </div>
    );

    return (
        <div className={styles.liqChartSectionContainer}>
            <OBLiqFetcher />
            {liqChartTabsComponent}
        </div>
    );
};

export default LiquidationsChartSection;
