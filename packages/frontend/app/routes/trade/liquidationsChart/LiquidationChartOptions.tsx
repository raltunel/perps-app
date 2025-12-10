import { useLiqChartStore } from '~/stores/LiqChartStore';
import styles from './LiquidationChartOptions.module.css';
import { useEffect, useRef } from 'react';

interface LiquidationChartOptionsProps {}

const LiquidationChartOptions: React.FC<
    LiquidationChartOptionsProps
> = ({}) => {
    const { showLiqOptions, setShowLiqOptions } = useLiqChartStore();

    useEffect(() => {
        if (showLiqOptions) {
            const targetElement = document.getElementById(
                'liquidations-settings-button',
            );
            if (targetElement) {
                const targetElementRect = targetElement.getBoundingClientRect();
                const liqOptionsWrapper = document.getElementById(
                    'liquidations-options-wrapper',
                );

                console.log('>>>>>> targetElementRect', targetElementRect);
                console.log('>>>>>> liqOptionsWrapper', liqOptionsWrapper);
                if (liqOptionsWrapper) {
                    liqOptionsWrapper.style.left = `${targetElementRect.left}px`;
                    liqOptionsWrapper.style.top = `${targetElementRect.bottom}px`;
                }
            }
        }
    }, [showLiqOptions]);

    return (
        <>
            {showLiqOptions ? (
                <div
                    id='liquidations-options-wrapper'
                    className={styles.liqOptionsWrapper}
                >
                    asdsadasd
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

export default LiquidationChartOptions;
