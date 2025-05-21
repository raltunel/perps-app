import { useAppSettings } from '~/stores/AppSettingsStore';
import styles from './symbolinfofield.module.css';

import { motion } from 'framer-motion';
import SkeletonNode from '~/components/Skeletons/SkeletonNode/SkeletonNode';

interface SymbolInfoFieldProps {
    label: string;
    value: string;
    lastWsChange?: number;
    type?: 'positive' | 'negative';
    valueClass?: string;
    skeleton?: boolean;
}

const SymbolInfoField: React.FC<SymbolInfoFieldProps> = ({
    label,
    value,
    lastWsChange,
    type,
    valueClass,
    skeleton = false,
}) => {
    const { getBsColor } = useAppSettings();

    const getValueColor = () => {
        if (type === 'positive') {
            return getBsColor().buy;
        }
        if (type === 'negative') {
            return getBsColor().sell;
        }
        return 'var(--text1)';
    };

    const renderValue = () => {
        if (skeleton) {
            return (
                <div className={`${styles.symbolInfoFieldValue} ${valueClass}`}>
                    <SkeletonNode height='20px' width='70%' />
                </div>
            );
        }
        if (lastWsChange) {
            return (
                <motion.div
                    key={lastWsChange}
                    className={`${styles.symbolInfoFieldValue} ${valueClass}`}
                    initial={{
                        color:
                            lastWsChange > 0
                                ? getBsColor().buy
                                : lastWsChange < 0
                                  ? getBsColor().sell
                                  : 'var(--text1)',
                    }}
                    animate={{ color: 'var(--text1)' }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    {value}
                </motion.div>
            );
        }
        return (
            <>
                <div
                    className={`${styles.symbolInfoFieldValue} ${valueClass}`}
                    style={{ color: getValueColor() }}
                >
                    {value}
                </div>
            </>
        );
    };

    return (
        <div className={styles.symbolInfoFieldWrapper}>
            <div className={`${styles.symbolInfoField}`}>
                <div className={styles.symbolInfoFieldLabel}>{label}</div>
                {renderValue()}
            </div>
        </div>
    );
};

export default SymbolInfoField;
