'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import DepositDropdown from '~/components/PageHeader/DepositDropdown/DepositDropdown';
import OrderInput from '~/components/Trade/OrderInput/OrderInput';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import TradingViewWrapper from '~/components/Tradingview/TradingviewWrapper';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { Route } from '../+types/root';
import styles from './trade.module.css';
import OrderBookSection from './trade/orderbook/orderbooksection';
import SymbolInfo from './trade/symbol/symbolinfo';
import TradeRouteHandler from './trade/traderoutehandler';
import WatchList from './trade/watchlist/watchlist';
import WebDataConsumer from './trade/webdataconsumer';

import ComboBoxContainer from '~/components/Inputs/ComboBox/ComboBoxContainer';
import AdvancedTutorialController from '~/components/Tutorial/AdvancedTutorialController';
import { useTutorial } from '~/hooks/useTutorial';

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Trade() {
    const { symbol } = useTradeDataStore();
    const symbolRef = useRef(symbol);
    symbolRef.current = symbol;
    const { orderBookMode } = useAppSettings();
    const { marketId } = useParams<{ marketId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('order');
    const [isMobile, setIsMobile] = useState(false);

    // Check if mobile device
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const { showTutorial, handleTutorialComplete, handleTutorialSkip } =
        useTutorial();

    useEffect(() => {
        document.body.style.overscrollBehaviorX = 'none';
        document.body.style.touchAction = 'pan-y';
        return () => {
            document.body.style.overscrollBehaviorX = 'auto';
            document.body.style.touchAction = 'auto';
        };
    }, []);

    // logic to automatically redirect the user if they land on a
    // ... route with no token symbol in the URL
    useEffect(() => {
        if (!marketId) navigate(`/trade/${symbol}`, { replace: true });
    }, [navigate, marketId, symbol]);

    // Mobile tab navigation - exactly matches the mockup
    const MobileTabNavigation = () => {
        return (
            <div className={styles.mobileTabNav}>
                <div className={styles.mobileTabBtns}>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'order' ? styles.active : ''}`}
                        onClick={() => setActiveTab('order')}
                    >
                        Order
                    </button>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'chart' ? styles.active : ''}`}
                        onClick={() => setActiveTab('chart')}
                    >
                        Chart
                    </button>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'book' ? styles.active : ''}`}
                        onClick={() => setActiveTab('book')}
                    >
                        Book
                    </button>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'recent' ? styles.active : ''}`}
                        onClick={() => setActiveTab('recent')}
                    >
                        Recent
                    </button>
                    <button
                        className={`${styles.mobileTabBtn} ${activeTab === 'positions' ? styles.active : ''}`}
                        onClick={() => setActiveTab('positions')}
                    >
                        Positions
                    </button>
                </div>
            </div>
        );
    };

    // For Book section on mobile, we'll use the OrderBookSection component but force it to show only the Order Book tab
    const MobileOrderBookView = () => {
        return (
            <div className={styles.mobileOnlyOrderBook}>
                <OrderBookSection
                    symbol={symbol}
                    mobileView={true}
                    mobileContent='orderBook'
                />
            </div>
        );
    };

    // For Recent section on mobile, we'll use the OrderBookSection component but force it to show only the Recent Trades tab
    const MobileRecentTradesView = () => {
        return (
            <div className={styles.mobileOnlyRecentTrades}>
                <OrderBookSection
                    symbol={symbol}
                    mobileView={true}
                    mobileContent='recentTrades'
                />
            </div>
        );
    };

    // Mobile view with tabs
    if (isMobile && symbol) {
        return (
            <>
                <TradeRouteHandler />
                <WebDataConsumer />
                <SymbolInfo />
                <MobileTabNavigation />

                {/* Order section */}
                <div
                    className={`${styles.mobileSection} ${styles.mobileOrder} ${activeTab === 'order' ? styles.active : ''}`}
                >
                    <OrderInput />
                </div>

                {/* Chart section */}
                <div
                    className={`${styles.mobileSection} ${styles.mobileChart} ${activeTab === 'chart' ? styles.active : ''}`}
                >
                    <TradingViewWrapper />
                </div>

                {/* Book section - Shows ONLY Order Book */}
                <div
                    className={`${styles.mobileSection} ${styles.mobileBook} ${activeTab === 'book' ? styles.active : ''}`}
                >
                    <MobileOrderBookView />
                </div>

                {/* Recent trades section - Shows ONLY Recent Trades */}
                <div
                    className={`${styles.mobileSection} ${styles.mobileRecent} ${activeTab === 'recent' ? styles.active : ''}`}
                >
                    <MobileRecentTradesView />
                </div>

                {/* Positions section */}
                <div
                    className={`${styles.mobileSection} ${styles.mobilePositions} ${activeTab === 'positions' ? styles.active : ''}`}
                >
                    <TradeTable />
                </div>
            </>
        );
    }

    // Desktop view (unchanged)
    return (
        <>
            <TradeRouteHandler />
            <WebDataConsumer />
            {symbol && (
                <div className={styles.container}>
                    <section
                        className={`${styles.containerTop} ${orderBookMode === 'large' ? styles.orderBookLarge : ''}`}
                    >
                        <div
                            className={`${styles.containerTopLeft} ${styles.symbolSectionWrapper}`}
                        >
                            <ComboBoxContainer />
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
                                <SymbolInfo />
                            </div>
                            <div id='chartSection' className={styles.chart}>
                                <TradingViewWrapper />
                            </div>
                        </div>

                        <div id='orderBookSection' className={styles.orderBook}>
                            <OrderBookSection symbol={symbol} />
                        </div>
                        <div
                            id='tradeModulesSection'
                            className={styles.tradeModules}
                        >
                            <OrderInput />
                        </div>
                    </section>
                    <section
                        id={'bottomSection'}
                        className={styles.containerBottom}
                    >
                        <div className={styles.table} id='tutorial-trade-table'>
                            <TradeTable />
                        </div>
                        <div className={styles.wallet}>
                            <DepositDropdown
                                isUserConnected={false}
                                setIsUserConnected={() =>
                                    console.log('connected')
                                }
                            />
                        </div>
                    </section>
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
