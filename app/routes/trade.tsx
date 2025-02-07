import { Link, Outlet } from 'react-router';
import type { Route } from './+types/home';
import styles from './trade.module.css';
export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
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
          {/* Child routes (market, limit, pro) appear here */}
          <section className={styles.containerTop}>Chart goes here</section>
          <section className={styles.containerBottom}>Table goes here</section>
      {/* <Outlet /> */}
    </div>
  );
}
