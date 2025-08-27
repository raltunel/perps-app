import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Resizable } from 're-resizable';
import type { NumberSize } from 're-resizable';
import DepositDropdown from '~/components/PageHeader/DepositDropdown/DepositDropdown';
import OrderInput from '~/components/Trade/OrderInput/OrderInput';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import TradingViewWrapper from '~/components/Tradingview/TradingviewWrapper';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './trade.module.css';
import OrderBookSection from './trade/orderbook/orderbooksection';
import SymbolInfo from './trade/symbol/symbolinfo';
import TradeRouteHandler from './trade/traderoutehandler';
import WatchList from './trade/watchlist/watchlist';
import WebDataConsumer from './trade/webdataconsumer';

import { motion } from 'framer-motion';
import ComboBoxContainer from '~/components/Inputs/ComboBox/ComboBoxContainer';
import AdvancedTutorialController from '~/components/Tutorial/AdvancedTutorialController';
import { useTutorial } from '~/hooks/useTutorial';
import { useUnifiedMarginData } from '~/hooks/useUnifiedMarginData';
import { useAppStateStore } from '~/stores/AppStateStore';
import { usePortfolioModals } from './portfolio/usePortfolioModals';

const MemoizedTradeTable = memo(TradeTable);
const MemoizedTradingViewWrapper = memo(TradingViewWrapper);
const MemoizedOrderBookSection = memo(OrderBookSection);
const MemoizedSymbolInfo = memo(SymbolInfo);

export type TabType = 'order' | 'chart' | 'book' | 'recent' | 'positions';

export default function Trade() {
    const { symbol } = useTradeDataStore();
    const { marginBucket } = useUnifiedMarginData();
    const symbolRef = useRef<string>(symbol);
    symbolRef.current = symbol;
    const { orderBookMode } = useAppSettings();
    const { marketId } = useParams<{ marketId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('order');
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const { debugToolbarOpen, setDebugToolbarOpen } = useAppStateStore();
    const debugToolbarOpenRef = useRef(debugToolbarOpen);
    debugToolbarOpenRef.current = debugToolbarOpen;

    const visibilityRefs = useRef({
        order: false,
        chart: false,
        book: false,
        recent: false,
        positions: false,
    });

    useEffect(() => {
        const checkIfMobile = () => {
            if (window.innerWidth <= 768 !== isMobile) {
                setIsMobile(window.innerWidth <= 768);
            }
        };
        checkIfMobile();
        let resizeTimer: NodeJS.Timeout | undefined;
        const handleResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(checkIfMobile, 100);
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobile]);

    const switchTab = useCallback(
        (tab: TabType) => {
            if (activeTab === tab) return;
            visibilityRefs.current = {
                order: tab === 'order',
                chart: tab === 'chart',
                book: tab === 'book',
                recent: tab === 'recent',
                positions: tab === 'positions',
            };
            requestAnimationFrame(() => setActiveTab(tab));
        },
        [activeTab],
    );

    useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.code === 'KeyD' && e.altKey) {
                e.preventDefault();
                setDebugToolbarOpen(!debugToolbarOpenRef.current);
            }
        };
        window.addEventListener('keydown', keydownHandler);
        return () => window.removeEventListener('keydown', keydownHandler);
    }, []);

    useEffect(() => {
        document.body.style.overscrollBehaviorX = 'none';
        document.body.style.touchAction = 'pan-y';
        return () => {
            document.body.style.overscrollBehaviorX = 'auto';
            document.body.style.touchAction = 'auto';
        };
    }, []);

    useEffect(() => {
        if (!marketId)
            navigate(`/v2/trade/${symbol}`, {
                replace: true,
                viewTransition: true,
            });
    }, [navigate, marketId, symbol]);

    const { showTutorial, handleTutorialComplete, handleTutorialSkip } =
        useTutorial();

    const tabList = useMemo(
        () =>
            [
                { key: 'order', label: 'Order' },
                { key: 'chart', label: 'Chart' },
                { key: 'book', label: 'Book' },
                { key: 'recent', label: 'Recent' },
                { key: 'positions', label: 'Positions' },
            ] as const,
        [],
    );

    const handleTabClick = useCallback(
        (tab: TabType) => () => switchTab(tab),
        [switchTab],
    );

    const MobileTabNavigation = useMemo(
        () => (
            <div className={styles.mobileTabNav}>
                <div className={styles.mobileTabBtns}>
                    {tabList.map(({ key, label }) => (
                        <button
                            key={key}
                            className={`${styles.mobileTabBtn} ${activeTab === key ? styles.active : ''}`}
                            onClick={handleTabClick(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>
        ),
        [activeTab, handleTabClick, tabList],
    );

    const mobileOrderBookView = useMemo(
        () => (
            <div className={styles.mobileOnlyOrderBook}>
                {(activeTab === 'book' || visibilityRefs.current.book) && (
                    <MemoizedOrderBookSection
                        symbol={symbol}
                        mobileView
                        mobileContent='orderBook'
                        switchTab={switchTab}
                    />
                )}
            </div>
        ),
        [symbol, activeTab, switchTab],
    );

    const mobileRecentTradesView = useMemo(
        () => (
            <div className={styles.mobileOnlyRecentTrades}>
                {(activeTab === 'recent' || visibilityRefs.current.recent) && (
                    <MemoizedOrderBookSection
                        symbol={symbol}
                        mobileView
                        mobileContent='recentTrades'
                    />
                )}
            </div>
        ),
        [symbol, activeTab],
    );

    const {
        openDepositModal,
        openWithdrawModal,
        PortfolioModalsRenderer,
        isAnyPortfolioModalOpen,
    } = usePortfolioModals();

    // --------------------------------------------
    // CONTROLLABLE CHART/TABLE SPLIT
    // - TABLE_DEFAULT should match  .wallet max-height in CSS
    // - TABLE_MIN prevents pushing the table any smaller
    const TABLE_DEFAULT = 195;
    const TABLE_MIN = 195;
    const CHART_MIN = 200;

    // read from LS
    const fromLS = () => {
        const v = localStorage.getItem('chartTopHeight');
        return v ? Math.max(CHART_MIN, parseInt(v)) : null;
    };

    const [chartTopHeight, setChartTopHeight] = useState<number>(
        fromLS() ?? 570,
    );
    const startHeightRef = useRef(chartTopHeight);

    const leftColRef = useRef<HTMLDivElement | null>(null);
    const [maxTop, setMaxTop] = useState<number>(Infinity);

    const getGap = () => {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue('--gap-s')
            .trim();
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 8;
    };

    // Compute default top height so that table = TABLE_DEFAULT
    const setDefaultFromLayout = useCallback(() => {
        const col = leftColRef.current;
        if (!col) return;
        const gap = getGap();
        const total = col.clientHeight;

        const top = Math.max(CHART_MIN, total - TABLE_DEFAULT - gap);
        setChartTopHeight(top);

        // cap max so the user cannot push table below TABLE_MIN
        const max = Math.max(CHART_MIN, total - TABLE_MIN - gap);
        setMaxTop(max);
    }, [TABLE_DEFAULT, TABLE_MIN]);

    useEffect(() => {
        const handler = () => {
            // ensure LS key is gone and recompute based on current viewport
            localStorage.removeItem('chartTopHeight');
            setDefaultFromLayout();
        };

        window.addEventListener('trade:resetLayout', handler as EventListener);
        return () =>
            window.removeEventListener(
                'trade:resetLayout',
                handler as EventListener,
            );
    }, [setDefaultFromLayout]);

    // If no LS value, compute default from layout on mount and when left column resizes
    useEffect(() => {
        if (!localStorage.getItem('chartTopHeight')) {
            requestAnimationFrame(() => setDefaultFromLayout());
        }
    }, [setDefaultFromLayout]);

    useEffect(() => {
        const col = leftColRef.current;
        if (!col) return;
        const ro = new ResizeObserver(() => setDefaultFromLayout());
        ro.observe(col);
        return () => ro.disconnect();
    }, [setDefaultFromLayout]);

    const clamp = (n: number) => Math.max(CHART_MIN, Math.min(n, maxTop));

    // Mobile view
    if (isMobile && symbol) {
        return (
            <>
                <TradeRouteHandler />
                <WebDataConsumer />
                <div className={styles.symbolInfoContainer}>
                    <MemoizedSymbolInfo />
                </div>
                {MobileTabNavigation}
                <div
                    className={`${styles.mobileSection} ${styles.mobileOrder} ${activeTab === 'order' ? styles.active : ''}`}
                    style={{
                        display: activeTab === 'order' ? 'block' : 'none',
                    }}
                >
                    {(activeTab === 'order' ||
                        visibilityRefs.current.order) && (
                        <OrderInput
                            marginBucket={marginBucket}
                            isAnyPortfolioModalOpen={isAnyPortfolioModalOpen}
                        />
                    )}
                </div>
                <div
                    className={`${styles.mobileSection} ${styles.mobileChart} ${activeTab === 'chart' ? styles.active : ''}`}
                    style={{
                        display: activeTab === 'chart' ? 'block' : 'none',
                    }}
                >
                    {(activeTab === 'chart' ||
                        visibilityRefs.current.chart) && (
                        <MemoizedTradingViewWrapper />
                    )}
                </div>
                <div
                    className={`${styles.mobileSection} ${styles.mobileBook} ${activeTab === 'book' ? styles.active : ''}`}
                    style={{ display: activeTab === 'book' ? 'block' : 'none' }}
                >
                    {activeTab === 'book' && mobileOrderBookView}
                </div>
                <div
                    className={`${styles.mobileSection} ${styles.mobileRecent} ${activeTab === 'recent' ? styles.active : ''}`}
                    style={{
                        display: activeTab === 'recent' ? 'block' : 'none',
                    }}
                >
                    {activeTab === 'recent' && mobileRecentTradesView}
                </div>
                <div
                    className={`${styles.mobileSection} ${styles.mobilePositions} ${activeTab === 'positions' ? styles.active : ''}`}
                    style={{
                        display: activeTab === 'positions' ? 'block' : 'none',
                    }}
                >
                    {(activeTab === 'positions' ||
                        visibilityRefs.current.positions) && (
                        <MemoizedTradeTable />
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <TradeRouteHandler />
            <WebDataConsumer />
            {symbol && (
                <div className={styles.containerNew}>
                    {/* LEFT COLUMN */}
                    <div className={styles.leftCol} ref={leftColRef}>
                        <Resizable
                            size={{ width: '100%', height: chartTopHeight }}
                            minHeight={CHART_MIN}
                            maxHeight={maxTop}
                            enable={{ bottom: true }}
                            handleStyles={{
                                bottom: { height: '8px', cursor: 'row-resize' },
                            }}
                            onResizeStart={() => {
                                startHeightRef.current = chartTopHeight;
                            }}
                            onResize={(e, dir, ref, d: NumberSize) => {
                                setChartTopHeight(
                                    clamp(startHeightRef.current + d.height),
                                );
                            }}
                            onResizeStop={(e, dir, ref, d: NumberSize) => {
                                const next = clamp(
                                    startHeightRef.current + d.height,
                                );
                                setChartTopHeight(next);
                                localStorage.setItem(
                                    'chartTopHeight',
                                    String(next),
                                );
                            }}
                        >
                            {/* TOP: chart + orderbook.  */}
                            <section
                                className={`${styles.containerTop} ${orderBookMode === 'large' ? styles.orderBookLarge : ''}`}
                                style={{ height: '100%' }}
                            >
                                <div
                                    id='trade-page-left-section'
                                    className={`${styles.containerTopLeft} ${styles.symbolSectionWrapper} ${debugToolbarOpen ? styles.debugToolbarOpen : ''}`}
                                >
                                    {debugToolbarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={`${styles.debugToolbar} ${debugToolbarOpen ? styles.open : ''}`}
                                        >
                                            <ComboBoxContainer />
                                        </motion.div>
                                    )}
                                    <div
                                        id='watchlistSection'
                                        className={styles.watchlist}
                                    >
                                        <WatchList />
                                    </div>
                                    <div
                                        id='symbolInfoSection'
                                        className={styles.symbolInfo}
                                    >
                                        <MemoizedSymbolInfo />
                                    </div>
                                    <div
                                        id='chartSection'
                                        className={styles.chart}
                                    >
                                        <MemoizedTradingViewWrapper />
                                    </div>
                                </div>
                                <div
                                    id='orderBookSection'
                                    className={styles.orderBook}
                                >
                                    <MemoizedOrderBookSection symbol={symbol} />
                                </div>
                            </section>
                        </Resizable>

                        {/* BOTTOM*/}
                        <section
                            className={styles.table}
                            id='tutorial-trade-table'
                        >
                            <MemoizedTradeTable />
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={styles.rightCol}>
                        <section className={styles.order_input}>
                            <OrderInput
                                marginBucket={marginBucket}
                                isAnyPortfolioModalOpen={
                                    isAnyPortfolioModalOpen
                                }
                            />
                        </section>
                        <section className={styles.wallet}>
                            <DepositDropdown
                                marginBucket={marginBucket}
                                openDepositModal={openDepositModal}
                                openWithdrawModal={openWithdrawModal}
                                PortfolioModalsRenderer={
                                    PortfolioModalsRenderer
                                }
                            />
                        </section>
                    </div>
                </div>
            )}
            <AdvancedTutorialController
                isEnabled={showTutorial}
                onComplete={handleTutorialComplete}
                onSkip={handleTutorialSkip}
            />
        </>
    );
}
