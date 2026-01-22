import { useRef } from 'react';
import styles from './LiqLevelsSlider.module.css';
import { useLiqChartStore } from '~/stores/LiqChartStore';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useLiquidationStore } from '~/stores/LiquidationStore';

export const LiqLevelsSlider = () => {
    const { liqLevels } = useLiqChartStore();
    const { liqThresholds } = useLiquidationStore();
    const trackRef = useRef<HTMLDivElement>(null);

    // Fixed threshold percentages for display (visual representation)
    const thresholdPercentages = [25, 50, 75];

    const getGradientSegments = () => {
        const segments: string[] = [];

        // Level 1 (Purple) from 0% to first threshold
        segments.push(`${liqLevels[3].color} 0%`);
        segments.push(`${liqLevels[3].color} ${thresholdPercentages[0]}%`);

        // Level 2 (Blue) from first to second threshold
        segments.push(`${liqLevels[2].color} ${thresholdPercentages[0]}%`);
        segments.push(`${liqLevels[2].color} ${thresholdPercentages[1]}%`);

        // Level 3 (Green) from second to third threshold
        segments.push(`${liqLevels[1].color} ${thresholdPercentages[1]}%`);
        segments.push(`${liqLevels[1].color} ${thresholdPercentages[2]}%`);

        // Level 4 (Yellow) from third threshold to 100%
        segments.push(`${liqLevels[0].color} ${thresholdPercentages[2]}%`);
        segments.push(`${liqLevels[0].color} 100%`);

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

    // Get level ranges for display using fixed thresholds
    const getLevelRanges = () => {
        return [
            {
                level: liqLevels[3],
                range: `MIN - ${formatThreshold(liqThresholds[0])}`,
            },
            {
                level: liqLevels[2],
                range: `${formatThreshold(liqThresholds[0])} - ${formatThreshold(liqThresholds[1])}`,
            },
            {
                level: liqLevels[1],
                range: `${formatThreshold(liqThresholds[1])} - ${formatThreshold(liqThresholds[2])}`,
            },
            {
                level: liqLevels[0],
                range: `${formatThreshold(liqThresholds[2])} - MAX`,
            },
        ];
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Liquidation Levels</h3>
            </div>
            <div className={styles.legend}>
                {getLevelRanges()
                    .reverse()
                    .map(({ level, range }) => (
                        <div key={level.id} className={styles.legendItem}>
                            <div
                                className={styles.colorIndicator}
                                style={{ backgroundColor: level.color }}
                            />
                            <span className={styles.levelLabel}>
                                {level.label}
                            </span>
                            <span className={styles.thresholdValue}>
                                {range}
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
                    }}
                >
                    {/* Static thumbs - no drag functionality */}
                    {thresholdPercentages.map((percentage, index) => {
                        const leftColor =
                            index === 0
                                ? liqLevels[3].color
                                : index === 1
                                  ? liqLevels[2].color
                                  : liqLevels[1].color;
                        const rightColor =
                            index === 0
                                ? liqLevels[2].color
                                : index === 1
                                  ? liqLevels[1].color
                                  : liqLevels[0].color;

                        return (
                            <>
                                <div
                                    key={index}
                                    // className={styles.thumb}
                                    className={
                                        styles.thumb + ' ' + styles.passiveThumb
                                    }
                                    style={
                                        {
                                            left: `${percentage}%`,
                                            '--gradient-left': leftColor,
                                            '--gradient-right': rightColor,
                                            cursor: 'default',
                                        } as React.CSSProperties
                                    }
                                >
                                    <span className={styles.passiveThumbLabel}>
                                        {formatThreshold(liqThresholds[index])}
                                    </span>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
