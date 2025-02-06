import { Link, Outlet } from 'react-router';
import type { Route } from './+types/home';

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
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '1rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'spaceBetween',
      }}
    >
      {/* <h2>Trade Layout</h2> */}

      {/* Example nav links to each child route */}
      <nav style={{ marginBottom: '1rem' }}>
        <Link to='market' style={{ marginRight: '1rem' }}>
          Market
        </Link>
        <Link to='limit' style={{ marginRight: '1rem' }}>
          Limit
        </Link>
        <Link to='pro' style={{ marginRight: '1rem' }}>
          Pro
        </Link>
      </nav>

          
      {/* Child routes (market, limit, pro) appear here */}
      <Outlet />
    </div>
  );
}
