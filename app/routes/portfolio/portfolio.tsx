import Welcome from '~/components/Welcome/Welcome';
import type { Route } from '../../+types/root';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import styles from './portfolio.module.css';
import PositionsTable from '~/components/Trade/PositionsTable/PositionsTable';
import { Link } from 'react-router';
// import styles from './portfolio.module.css'
export function meta({}: Route.MetaArgs) {
    return [
        { title: 'Perps - Portfolio' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export function loader({ context }: Route.LoaderArgs) {
    return { message: context.VALUE_FROM_NETLIFY };
}

export default function Portfolio({ loaderData }: Route.ComponentProps) {
    return (
        // <Welcome title='Portfolio' />
        <div className={styles.container}>
            <header>Portfolio</header>
            <div className={styles.column}>
                <div className={styles.detailsContainer}>
                    <div className={styles.detailsContent}>
                        <h6>14 Day Volume</h6>
                        <h3>$0</h3>
                        <Link to='/'>View volume</Link>
                    </div>
                    <div className={styles.detailsContent}>
                        <h6>Fees (Taker / Maker)</h6>
                        <h3>0.0350% / 0.0100%</h3>
                        <Link to='/'>View fee schedule</Link>
                    </div>
                    <div className={styles.totalNetDisplay}>
                        <h6>
                            <span>Total Net USD Value:</span> $1,987,654,32
                        </h6>
                        <div className={styles.rowButton}>
                            <button>Deposit</button>
                            <button>Withdraw</button>
                        </div>
                        <button>Send</button>
                    </div>
                </div>

                <div></div>
            </div>
        </div>
    );
}
