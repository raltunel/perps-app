import styles from './strategies.module.css';
import { useNavigate } from 'react-router';

export default function Strategies() {
    const navigate = useNavigate();

    return (
        <div className={styles.strategies_page}>
            <h2>Strategies</h2>
            <button
                onClick={() => {
                    navigate(
                        '/strategies/0xECB63caA47c7c4E77F60f1cE858Cf28dC2B82b00',
                    );
                }}
            >
                View Strategy
            </button>
        </div>
    );
}
