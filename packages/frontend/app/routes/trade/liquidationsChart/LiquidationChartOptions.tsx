import { useLiqChartStore } from '~/stores/LiqChartStore';
import styles from './LiquidationChartOptions.module.css';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LiqLevelsSlider } from '~/components/Liquidations/LiqLevelsSlider/LiqLevelsSlider';

interface LiquidationChartOptionsProps {}

const LiquidationChartOptions: React.FC<
    LiquidationChartOptionsProps
> = ({}) => {
    const { showLiqOptions, setShowLiqOptions } = useLiqChartStore();

    useEffect(() => {
        if (showLiqOptions) {
            const tvIframe = document.querySelector(
                '#tv_chart iframe',
            ) as HTMLIFrameElement;
            if (tvIframe) {
                const tvIframeDoc = tvIframe.contentDocument;
                if (tvIframeDoc) {
                    const targetElement = tvIframeDoc.getElementById(
                        'liquidations-settings-button',
                    );
                    if (targetElement) {
                        const targetElementRect =
                            targetElement.getBoundingClientRect();
                        const liqOptionsWrapper = document.getElementById(
                            'liquidations-options-wrapper',
                        );

                        if (liqOptionsWrapper) {
                            liqOptionsWrapper.style.left = `${targetElementRect.left + tvIframe.getBoundingClientRect().left}px`;
                            liqOptionsWrapper.style.top = `${targetElementRect.bottom + tvIframe.getBoundingClientRect().top}px`;
                        }
                    }
                }
            }
        }
    }, [showLiqOptions]);

    return (
        <>
            {showLiqOptions ? (
                <motion.div
                    id='liquidations-options-wrapper'
                    className={styles.liqOptionsWrapper}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className={styles.liqOptionsHeader}>
                        Liquidation Options
                    </div>
                    <div className={styles.liqOptionsRow}>
                        {/* <div className={styles.liqOptionsLabel}>Levels</div> */}
                        <div className={styles.liqOptionsValue}>
                            <LiqLevelsSlider onLevelsChange={() => {}} />
                        </div>
                    </div>
                </motion.div>
            ) : (
                <></>
            )}
        </>
    );
};

export default LiquidationChartOptions;
