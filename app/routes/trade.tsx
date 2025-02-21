import { WebSocketProvider } from '~/contexts/WebSocketContext';
import type { Route } from '../+types/root';
import styles from './trade.module.css';
import TradingViewChart from "./chart/chart";
import OrderBook from './trade/orderbook/orderbook';
import TradingViewWrapper from '~/components/Tradingview/TradingviewWrapper';
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TRADE' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_NETLIFY };
}

export default function Trade({ loaderData }: Route.ComponentProps) {
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
    <WebSocketProvider url='wss://api.hyperliquid.xyz/ws'>
    <div className={styles.container}>
      <section className={styles.containerTop}>
        <div className={styles.containerTopLeft}>
          <div className={styles.watchlist}>watchlist</div>
          <div className={styles.symbolInfo}>symbol info</div>
          <div className={styles.chart}>
            <TradingViewWrapper />
          </div>
        </div>

        <div className={styles.orderBook}><OrderBook symbol="BTCUSDT" /></div>

        <div className={styles.tradeModules}>trade module goes here</div>
      </section>
      <section className={styles.containerBottom}>Table goes here</section>
      {/* Child routes (market, limit, pro) appear here */}
      {/* <Outlet /> */}
    </div>
    </WebSocketProvider>
  );
}
