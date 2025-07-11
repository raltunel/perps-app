import { motion } from 'framer-motion';
import WsLogo from './WsLogo/WsLogo';
import styles from './WsReconnectingIndicator.module.css';

export default function WsReconnectingIndicator() {
    return (
        <motion.div
            className={styles.wsReconnectingIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.wsReconnectingIndicatorContent}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.wsLogoWrapper}>
                        <WsLogo />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={styles.indicatorText}
                >
                    <div className={styles.indicatorTextWrapper}>
                        Connecting to the websocket...
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
