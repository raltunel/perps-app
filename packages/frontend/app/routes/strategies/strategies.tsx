import Button from '~/components/Button/Button';
import styles from './strategies.module.css';
import OrderHistory from '../orderHistory/orderHistory';
import { useNavigate } from 'react-router';

export default function Strategies() {
    const navigate = useNavigate();

    return (
        <div className={styles.strategies_page}>
            <h2>Strategies</h2>
            <p className={styles.strategies_blurb}>
                Run an automated market making strategy
            </p>
            <div className={styles.strategies_learn_more}>Learn more</div>
            <div className={styles.strategy_select}>
                <div className={styles.strategy_select_left}>
                    <label>Select Strategy</label>
                    <div>Tight!</div>
                    <Button
                        onClick={() => console.log('Strategy Paused!')}
                        size='medium'
                        selected
                    >
                        Pause
                    </Button>
                    <Button
                        onClick={() => console.log('Strategy Removed!')}
                        size='medium'
                        selected
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={() => console.log('Editing strategy!')}
                        size='medium'
                        selected
                    >
                        Edit
                    </Button>
                </div>
                <div className={styles.strategy_select_right}>
                    <Button
                        onClick={() => navigate('/strategies/new')}
                        size='medium'
                        selected
                    >
                        New Strategy
                    </Button>
                </div>
            </div>
            <div className={styles.strategy_details}>
                <div className={styles.strategy_details_table}>
                    <header>
                        <span>Parameters</span>
                    </header>
                    <section>
                        <div>
                            <div>Market</div>
                            <div>BTC</div>
                        </div>
                        <div>
                            <div>Distance</div>
                            <div>2</div>
                        </div>
                        <div>
                            <div>Distance Type</div>
                            <div>Ticks</div>
                        </div>
                        <div>
                            <div>Side</div>
                            <div>Both</div>
                        </div>
                        <div>
                            <div>Total Size</div>
                            <div>$100,000</div>
                        </div>
                        <div>
                            <div>Order Size</div>
                            <div>$10,000</div>
                        </div>
                    </section>
                </div>
                <div className={styles.strategy_details_table}>
                    <header>
                        <span>Performance</span>
                    </header>
                    <section>
                        <div>
                            <div>PNL</div>
                            <div>$0.00</div>
                        </div>
                        <div>
                            <div>Volume</div>
                            <div>$0.00</div>
                        </div>
                        <div>
                            <div>Max Drawdown</div>
                            <div>0.00%</div>
                        </div>
                        <div>
                            <div>Orders Placed</div>
                            <div>0</div>
                        </div>
                        <div>
                            <div>Runtime</div>
                            <div>0 hours</div>
                        </div>
                    </section>
                </div>
                <div className={styles.strategy_details_graph}></div>
            </div>
            <OrderHistory />
        </div>
    );
}
