import type { Route } from '../+types/root';
import styles from './trade.module.css';
import DepositDropdown from '~/components/PageHeader/DepositDropdown/DepositDropdown';
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
    <div className={styles.container}>
      <section className={styles.containerTop}>
        <div className={styles.containerTopLeft}>
          <div className={styles.watchlist}></div>
          <div className={styles.symbolInfo}></div>
          <div className={styles.chart}></div>
        </div>

        <div className={styles.orderBook}></div>

        <div className={styles.tradeModules}></div>
      </section>
      <section className={styles.containerBottom}>
        <div className={styles.table}>table</div>
        <div className={styles.wallet}>
          <DepositDropdown
            isUserConnected={false}
            setIsUserConnected={() => console.log('connected')}
          />
        </div>
      </section>
      {/* Child routes (market, limit, pro) appear here */}
      {/* <Outlet /> */}
    </div>
  );
}
