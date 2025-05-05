import { useState } from 'react';
import styles from './Spinner.module.css';
import { motion } from 'framer-motion';

interface SpinnerProps {
    absolute?: boolean;
    width?: number;
    height?: number;
    size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 48, absolute = false }) => {
    return (
        <>
            <motion.div
                className={`${styles.spinnerWrapper} ${absolute ? styles.absolute : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <span
                    className={styles.spinner}
                    style={{ width: size, height: size, fontSize: size }}
                ></span>
            </motion.div>
        </>
    );
};

export default Spinner;
