'use client';

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
import { useNavigate, useParams } from 'react-router';
export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'TRADE' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Trade({ loaderData }: Route.ComponentProps) {

  const { symbol } = useTradeDataStore();
  const { marketId } = useParams<{ marketId: string }>();
  const navigate = useNavigate();
  // logic to automatically redirect the user if they land on a
  // ... route with no token symbol in the URL
  useEffect(() => {
    marketId ?? navigate(`/trade/${symbol}`, { replace: true });
  }, [navigate]);

  
  const symbolRef = useRef<string>(symbol);
  symbolRef.current = symbol;
  const { orderBookMode } = useAppSettings();

  const { wsUrl, setWsUrl, debugWallet, setDebugWallet, isWsEnabled, setIsWsEnabled } = useDebugStore();

  return (
    <>
      <title>{`${marketId || 'BTC'}`}</title>
      <meta
          property='og:image'
          content={`https://res.cloudinary.com/demo/image/upload/l_text:Arial_50_bold:${
              marketId || 'BTC'
          }%20USDC,co_rgb:FFFFFF,c_fit,w_1000,h_500/v1/background.jpg`}
      />
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

      <TradeRouteHandler />
      <WebDataConsumer />
      {
        symbol && symbol.length > 0 && (

          <div className={styles.container}>
            <section className={`${styles.containerTop} ${orderBookMode === 'large' ? styles.orderBookLarge : ''}`}>
              <div className={styles.containerTopLeft}>
                <div id='watchlistSection' className={styles.watchlist}><WatchList /></div>
                <div id='symbolInfoSection' className={styles.symbolInfo}>
                  <SymbolInfo />
                </div>
                <div id='chartSection' className={styles.chart}><TradingViewWrapper /></div>
              </div>

              <div id='orderBookSection' className={styles.orderBook}><OrderBookSection symbol={symbol} /></div>
              <div id='tradeModulesSection' className={styles.tradeModules}><OrderInput /></div>
            </section>
            <section id={'bottomSection'} className={styles.containerBottom}>
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
    </>
  );
}
