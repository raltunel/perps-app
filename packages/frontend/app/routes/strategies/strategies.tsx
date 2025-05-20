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
            <OrderHistory />
        </div>
    );
}
