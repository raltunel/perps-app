import { useRef } from 'react';
import styles from './LiqLevelsSlider.module.css';
import { useLiquidationStore } from '~/stores/LiquidationStore';
import {
    LIQ_COLOR_TRANSPARENT,
    LIQ_COLOR_BASE,
    LIQ_COLOR_TOP,
    LIQ_COLOR_YELLOW,
    interpolateLiqColor,
} from '~/routes/trade/liquidationsChart/LiquidationUtils';

export const LiqLevelsSlider = () => {
    const { liqThresholds } = useLiquidationStore();
    const trackRef = useRef<HTMLDivElement>(null);

    const threshold100K = liqThresholds[0]; // 100,000
    const threshold10M = liqThresholds[2]; // 10,000,000

    const thresholdPercentages = [33, 80];

    const getGradientSegments = () => {
        const segments: string[] = [];

        segments.push(`${LIQ_COLOR_TRANSPARENT} 0%`);
        segments.push(`${LIQ_COLOR_TRANSPARENT} ${thresholdPercentages[0]}%`);

        // const gradientStops = 10;
        // for (let i = 0; i <= gradientStops; i++) {
        //     const progress = i / gradientStops;
        //     const position =
        //         thresholdPercentages[0] +
        //         progress * (thresholdPercentages[1] - thresholdPercentages[0]);
        //     const color = interpolateLiqColor(progress);
        //     segments.push(`${color} ${position}%`);
        // }

        segments.push(`${LIQ_COLOR_BASE} ${thresholdPercentages[0]}%`);
        segments.push(`${LIQ_COLOR_TOP} ${thresholdPercentages[1]}%`);

        segments.push(`${LIQ_COLOR_YELLOW} ${thresholdPercentages[1]}%`);
        segments.push(`${LIQ_COLOR_YELLOW} 100%`);

        return segments.join(', ');
    };

    const formatThreshold = (value: number) => {
        if (value >= 1_000_000) {
            return `$${(value / 1_000_000).toFixed(1)}M`;
        }
        if (value >= 1_000) {
            return `$${(value / 1_000).toFixed(0)}K`;
        }
        return `$${value.toFixed(0)}`;
    };

    // 3 level ranges for display
    const levelRanges = [
        {
            id: 0,
            label: 'High',
            color: LIQ_COLOR_YELLOW,
            range: `${formatThreshold(threshold10M)} - MAX`,
            isSolidColor: true,
        },
        {
            id: 1,
            label: 'Medium',
            color: interpolateLiqColor(0.5), // Middle color of the gradient
            range: `${formatThreshold(threshold100K)} - ${formatThreshold(threshold10M)}`,
            isGradient: true,
        },
        {
            id: 2,
            label: 'Low',
            color: LIQ_COLOR_TRANSPARENT,
            range: `MIN - ${formatThreshold(threshold100K)}`,
            isTransparent: true,
        },
    ];

    // Threshold display data (only 2 thresholds now)
    const thresholdData = [
        {
            percentage: thresholdPercentages[0],
            value: threshold100K,
            leftColor: LIQ_COLOR_TRANSPARENT,
            rightColor: LIQ_COLOR_BASE,
        },
        {
            percentage: thresholdPercentages[1],
            value: threshold10M,
            leftColor: LIQ_COLOR_TOP,
            rightColor: LIQ_COLOR_YELLOW,
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Liquidation Levels</h3>
            </div>
            <div className={styles.legend}>
                {levelRanges.map((level) => (
                    <div key={level.id} className={styles.legendItem}>
                        <div
                            className={styles.colorIndicator}
                            style={{
                                ...(level.isGradient
                                    ? {
                                          background: `linear-gradient(to right, ${LIQ_COLOR_BASE}, ${LIQ_COLOR_TOP})`,
                                      }
                                    : { backgroundColor: level.color }),
                                ...(level.isSolidColor
                                    ? { backgroundColor: level.color }
                                    : {}),
                                border: level.isTransparent
                                    ? '1px dashed rgba(255, 255, 255, 0.3)'
                                    : undefined,
                            }}
                        />
                        <span className={styles.levelLabel}>{level.label}</span>
                        <span className={styles.thresholdValue}>
                            {level.range}
                        </span>
                    </div>
                ))}
            </div>
            <div className={styles.sliderWrapper}>
                <div
                    ref={trackRef}
                    className={styles.track}
                    style={{
                        background: `linear-gradient(to right, ${getGradientSegments()})`,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    {/* Static thumbs - only 2 now for 100K and 10M */}
                    {thresholdData.map((threshold, index) => (
                        <div
                            key={index}
                            className={styles.thumb + ' ' + styles.passiveThumb}
                            style={
                                {
                                    left: `${threshold.percentage}%`,
                                    '--gradient-left': threshold.leftColor,
                                    '--gradient-right': threshold.rightColor,
                                    cursor: 'default',
                                } as React.CSSProperties
                            }
                        >
                            <span className={styles.passiveThumbLabel}>
                                {formatThreshold(threshold.value)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
