import styles from './trademodules.module.css';
interface TradeModulesProps {}

const TradeModules: React.FC<TradeModulesProps> = () => {
    return (
        <div className={styles.tradeModulesContainer}>
            {/* {
        tradeSlot && (
            <div className={styles.tradeSlot}>
                <div className={styles.tradeSlotCoin}>{tradeSlot.coin}</div>
                <div className={styles.tradeSlotPrice}>Price: {tradeSlot.price}</div>
                <div className={styles.tradeSlotAmount}>Amount: {tradeSlot.amount}</div>
            </div>
        )
     } */}
        </div>
    );
};

export default TradeModules;
