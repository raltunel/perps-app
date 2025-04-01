'use client';

import React from 'react';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';
import DepositDropdown from '~/components/PageHeader/DepositDropdown/DepositDropdown';
import OrderInput from '~/components/Trade/OrderInput/OrderInput';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import TradingViewWrapper from '~/components/Tradingview/TradingviewWrapper';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useDebugStore } from '~/stores/DebugStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { debugWallets, wsUrls } from '~/utils/Constants';
import type { Route } from '../+types/root';
import styles from './trade.module.css';
import OrderBookSection from './trade/orderbook/orderbooksection';
import SymbolInfo from './trade/symbol/symbolinfo';
import TradeRouteHandler from './trade/traderoutehandler';
import WatchList from './trade/watchlist/watchlist';
import { useEffect, useRef } from 'react';
import WebDataConsumer from './trade/webdataconsumer';
import LsConsumer from './trade/lsconsumer';
export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'TRADE' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

// const wsUrl = 'wss://api.hyperliquid.xyz/ws';
// const wsUrl = 'wss://pulse-api-mock.liquidity.tools/ws';

export default function Trade({ loaderData }: Route.ComponentProps) {
  // Trade bileşeninizin en üstüne
  useEffect(() => {
    console.log("Trade component hydrated");

    // 3 saniye sonra komponentlerin durumunu kontrol et
    setTimeout(() => {
      console.log("Symbol:", symbol);
      console.log("wsUrl options count:", wsUrls.length);
      console.log("debugWallet options count:", debugWallets.length);
      console.log("DOM status:", {
        symbolInfoExists: !!document.querySelector(`.${styles.symbolInfo}`),
        chartExists: !!document.querySelector(`#chartSection`),
        orderBookExists: !!document.querySelector(`#orderBookSection`)
      });
    }, 3000);
  }, []);


  const { symbol, setSymbol } = useTradeDataStore();
  const symbolRef = useRef(symbol);
  symbolRef.current = symbol;
  const { orderBookMode } = useAppSettings();




  const { wsUrl, setWsUrl, debugWallet, setDebugWallet, isWsEnabled, setIsWsEnabled } = useDebugStore();


  // if(!symbol || symbol.length === 0){
  //   setTimeout(() => {
  //     if(symbolRef.current && symbolRef.current.length === 0){
  //       setSymbol('BTC');
  //     }
  //   }, 1000);
  // }

  // const nav = (
  //      {/* Example nav links to each child route */}
  //   <nav style={{ marginBottom: '1rem' }}>
  //   <Link to='market' style={{ marginRight: '1rem' }}>
  //     Market
  //   </Link>
  //   <Link to='limit' style={{ marginRight: '1rem' }}>
  //     Limit
  //   </Link>
  //   <Link to='pro' style={{ marginRight: '1rem' }}>
  //     Pro
  //   </Link>
  // </nav>

  // )

  return (
    <>
      <div className={styles.wsUrlSelector}>
        <ComboBox
          value={wsUrl}
          options={wsUrls}
          onChange={(value) => setWsUrl(value)}
        />
      </div>
      <div className={styles.walletSelector}>
        <ComboBox
          value={debugWallet.label}
          options={debugWallets}
          fieldName='label'
          onChange={(value) => setDebugWallet({ label: value, address: debugWallets.find((wallet) => wallet.label === value)?.address || '' })}
        />
      </div>

      <div className={`${styles.wsToggle} ${isWsEnabled ? styles.wsToggleRunning : styles.wsTogglePaused}`} onClick={() => setIsWsEnabled(!isWsEnabled)}>
        <div
          className={styles.wsToggleButton}
        > {isWsEnabled ? 'WS Running' : 'Paused'}</div>
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TradeRouteHandler />
        <WebDataConsumer />
        <LsConsumer />
        {
          symbol && symbol.length > 0 && (

            <div className={styles.container}>
              <section className={`${styles.containerTop} ${orderBookMode === 'large' ? styles.orderBookLarge : ''}`}>
                <div className={styles.containerTopLeft}>
                  <div className={styles.watchlist}><WatchList /></div>
                  <div className={styles.symbolInfo}>

                    <SymbolInfo />


                  </div>
                  <div id='chartSection' className={styles.chart}><TradingViewWrapper /></div>
                </div>

                <div id='orderBookSection' className={styles.orderBook}><OrderBookSection symbol={symbol} /></div>
                <div className={styles.tradeModules}><OrderInput /></div>
              </section>
              <section className={styles.containerBottom}>
                <div className={styles.table}>
                  <TradeTable />
                </div>
                <div className={styles.wallet}>
                  <DepositDropdown
                    isUserConnected={false}
                    setIsUserConnected={() => console.log('connected')}
                  />
                </div>
              </section>

            </div>

          )
        }
      </React.Suspense>
    </>
  );
}
