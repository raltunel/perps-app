import Button from '~/components/Button/Button';
import styles from './strategies.module.css';
import OrderHistoryTable from '~/components/Trade/OrderHistoryTable/OrderHistoryTable';

export default function Strategies() {
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
                </div>
                <div className={styles.strategy_select_right}>
                    <Button
                        onClick={() => console.log('Making new strategy!')}
                        size='medium'
                        selected
                    >
                        New Strategy
                    </Button>
                </div>
            </div>
            <OrderHistoryTable />
        </div>
    );
}
