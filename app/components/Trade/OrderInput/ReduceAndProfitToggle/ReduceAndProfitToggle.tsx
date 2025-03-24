import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';
import styles from './ReduceAndProfitToggle.module.css';

interface PropsIF {
    isReduceOnlyEnabled: boolean;
    isTakeProfitEnabled: boolean;
    handleToggleReduceOnly: (newState?: boolean) => void;
    handleToggleProfitOnly: (newState?: boolean) => void;
}
export default function ReduceAndProfitToggle(props: PropsIF) {
    const {
        isReduceOnlyEnabled,
        isTakeProfitEnabled,
        handleToggleReduceOnly,
        handleToggleProfitOnly,
    } = props;

    return (
        <div className={styles.reduceToggleContainer}>
            <div className={styles.reduceToggleContent}>
                <ToggleSwitch
                    isOn={isReduceOnlyEnabled}
                    onToggle={handleToggleReduceOnly}
                    label=''
                />
                <h3 className={styles.toggleLabel}>Reduce Only</h3>
            </div>
            <div className={styles.reduceToggleContent}>
                <ToggleSwitch
                    isOn={isTakeProfitEnabled}
                    onToggle={handleToggleProfitOnly}
                    label=''
                />
                <h3 className={styles.toggleLabel}>Take Profit / Stop Loss</h3>
            </div>
        </div>
    );
}
