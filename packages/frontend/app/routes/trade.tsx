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
import TutorialController from '~/components/Tutorial/TutorialController';
import AdvancedTutorialController from '~/components/Tutorial/AdvancedTutorialController';

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

    const [showTutorial, setShowTutorial] = useState(false);
    const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
    // Check local storage on initial load to see if the user has completed the tutorial
    useEffect(() => {
        const tutorialCompleted = localStorage.getItem(
            'ambientFinanceTutorialCompleted',
        );
        if (tutorialCompleted) {
            setHasCompletedTutorial(true);
        } else {
            // Show tutorial automatically for new users
            setShowTutorial(true);
        }
    }, []);

    const handleTutorialComplete = () => {
        setShowTutorial(false);
        setHasCompletedTutorial(true);
        localStorage.setItem('ambientFinanceTutorialCompleted', 'true');
    };

    const handleTutorialSkip = () => {
        setShowTutorial(false);
        // You might want to ask the user if they want to see the tutorial later
        // or simply mark it as completed
        localStorage.setItem('ambientFinanceTutorialCompleted', 'true');
    };

    const handleRestartTutorial = () => {
        setShowTutorial(true);
    };

    // useEffect(() => {
    //     const info = new Info({ environment: 'mock' });
    //     console.log({ wsManager: info.wsManager });
    // }, []);

    // logic to automatically redirect the user if they land on a
    // ... route with no token symbol in the URL
    useEffect(() => {
        if (!marketId) navigate(`/trade/${symbol}`, { replace: true });
    }, [navigate]);

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
                            
                                <button onClick={handleRestartTutorial}>
                                    Show Tutorial
                                </button>
                            
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
            {/* <TutorialController
        isEnabled={showTutorial}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
            /> */}
            <AdvancedTutorialController
  isEnabled={showTutorial}
  onComplete={handleTutorialComplete}
  onSkip={handleTutorialSkip}
/>
        </>
    );
}