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
import { getSizePercentageSegment } from '~/utils/functions/getSegment';

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

    const {
        orderBookMode,
        chartTopHeight: storedHeight,
        setChartTopHeight,
        resetLayoutHeights,
    } = useAppSettings();

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

    // --------------------------------------------
    // CONTROLLABLE CHART/TABLE SPLIT (persisted)
    // --------------------------------------------
    // These control alignment with right column wallet:
    const TABLE_DEFAULT = 195; // should match .wallet max-height in CSS
    const TABLE_MIN = 195;
    const CHART_MIN = 200;

    const leftColRef = useRef<HTMLDivElement | null>(null);

    // local state used while dragging for immediate feedback
    const [chartTopHeight, setChartTopHeightLocal] = useState<number>(
        storedHeight ?? 570,
    );
    const startHeightRef = useRef(chartTopHeight);
    const [maxTop, setMaxTop] = useState<number>(Infinity);

    const setHeightBoth = (h: number) => {
        setChartTopHeightLocal(h);
        setChartTopHeight(h);
        if (typeof plausible === 'function') {
            const newTradeTableHeightAsPercentageOfWindowHeight =
                ((window.innerHeight - h) / window.innerHeight) * 100;
            plausible('Trade Table Resize', {
                props: {
                    percentOfWindowHeight: getSizePercentageSegment(
                        newTradeTableHeightAsPercentageOfWindowHeight,
                    ),
                },
            });
        }
    };

    const getGap = () => {
        const raw = getComputedStyle(document.documentElement)
            .getPropertyValue('--gap-s')
            .trim();
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 8;
    };

    // Compute default from layout
    const setDefaultFromLayout = useCallback(() => {
        const col = leftColRef.current;
        if (!col) return;

        const gap = getGap();
        const total = col.clientHeight;

        const top = Math.max(CHART_MIN, total - TABLE_DEFAULT - gap);
        setChartTopHeightLocal(top);
        setChartTopHeight(top);

        const max = Math.max(CHART_MIN, total - TABLE_MIN - gap);
        setMaxTop(max);
    }, [setChartTopHeight]);

    // On mount / when store changes:
    useEffect(() => {
        const col = leftColRef.current;
        if (!col) return;

        const gap = getGap();
        const total = col.clientHeight;
        const max = Math.max(CHART_MIN, total - TABLE_MIN - gap);
        setMaxTop(max);

        if (storedHeight == null) {
            // if no user override, compute from layout
            requestAnimationFrame(setDefaultFromLayout);
        } else {
            // clamp the stored value to current bounds
            const clamped = Math.min(Math.max(storedHeight, CHART_MIN), max);
            setChartTopHeightLocal(clamped);
            if (clamped !== storedHeight) setChartTopHeight(clamped);
        }
    }, [storedHeight, setDefaultFromLayout, setChartTopHeight]);

    // Recompute (or clamp) when the left column resizes
    useEffect(() => {
        const col = leftColRef.current;
        if (!col) return;
        const ro = new ResizeObserver(() => {
            const gap = getGap();
            const total = col.clientHeight;
            const max = Math.max(CHART_MIN, total - TABLE_MIN - gap);
            setMaxTop(max);

            if (storedHeight == null) {
                setDefaultFromLayout();
            } else {
                setChartTopHeightLocal((h) =>
                    Math.min(Math.max(h, CHART_MIN), max),
                );
            }
        });
        ro.observe(col);
        return () => ro.disconnect();
    }, [storedHeight, setDefaultFromLayout]);

    //  listen for global reset event
    useEffect(() => {
        const handler = () => {
            resetLayoutHeights();
            requestAnimationFrame(setDefaultFromLayout);
        };
        window.addEventListener('trade:resetLayout', handler as EventListener);
        return () =>
            window.removeEventListener(
                'trade:resetLayout',
                handler as EventListener,
            );
    }, [resetLayoutHeights, setDefaultFromLayout]);

    const clamp = (n: number) => Math.max(CHART_MIN, Math.min(n, maxTop));

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
                        chartTopHeight={chartTopHeight}
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
                        chartTopHeight={chartTopHeight}
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
                                setChartTopHeightLocal(
                                    clamp(startHeightRef.current + d.height),
                                );
                            }}
                            onResizeStop={(e, dir, ref, d: NumberSize) => {
                                const next = clamp(
                                    startHeightRef.current + d.height,
                                );
                                setHeightBoth(next);
                            }}
                        >
                            {/* TOP: chart + orderbook. Force 100% to fill Resizable */}
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
                                    <MemoizedOrderBookSection
                                        symbol={symbol}
                                        chartTopHeight={chartTopHeight}
                                    />
                                </div>
                            </section>
                        </Resizable>

                        {/* BOTTOM: table auto-fills leftover space */}
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
