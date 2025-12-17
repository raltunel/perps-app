import { useState, useRef, useEffect } from 'react';
import styles from './LiqLevelsSlider.module.css';
import { useLiqChartStore, type LiqLevel } from '~/stores/LiqChartStore';
import useNumFormatter from '~/hooks/useNumFormatter';

interface LiqThreshold {
    id: number;
    value: number;
}

interface LiqLevelsSliderProps {
    onThresholdsChange?: (thresholds: number[]) => void;
}

export const LiqLevelsSlider = ({
    onThresholdsChange,
}: LiqLevelsSliderProps) => {
    const { liqLevels, setLiqLevels, maxLiqValue, minLiqValue } =
        useLiqChartStore();

    // Default threshold values
    const defaultThresholds: LiqThreshold[] = [
        { id: 1, value: 50 },
        { id: 2, value: 70 },
        { id: 3, value: 80 },
    ];

    const { formatNum } = useNumFormatter();

    // 3 thresholds to create 4 sections
    const [thresholds, setThresholds] =
        useState<LiqThreshold[]>(defaultThresholds);

    useEffect(() => {
        const newLiqLevels = [...liqLevels];

        thresholds.forEach((threshold) => {
            const level = newLiqLevels.find(
                (level) => level.id === threshold.id,
            );
            const prevLevel = newLiqLevels.find(
                (level) => level.id === threshold.id - 1,
            );
            if (level) {
                level.minRatio = threshold.value;
            }
            if (prevLevel) {
                prevLevel.maxRatio = threshold.value;
            }
        });

        setLiqLevels(newLiqLevels);
    }, [thresholds]);

    const [draggingId, setDraggingId] = useState<number | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    const handleReset = () => {
        setThresholds(defaultThresholds);
        onThresholdsChange?.(
            defaultThresholds.map((t) => t.value).sort((a, b) => a - b),
        );
    };

    const handleThresholdChange = (id: number, newValue: number) => {
        // Get sorted thresholds to find adjacent ones
        const sortedThresholds = [...thresholds].sort(
            (a, b) => a.value - b.value,
        );
        const currentIndex = sortedThresholds.findIndex((t) => t.id === id);

        let minBound = 1;
        let maxBound = 99;

        // Set constraints based on adjacent thumbs
        if (currentIndex > 0) {
            minBound = sortedThresholds[currentIndex - 1].value + 1;
        }
        if (currentIndex < sortedThresholds.length - 1) {
            maxBound = sortedThresholds[currentIndex + 1].value - 1;
        }

        // Constrain the new threshold
        const constrainedValue = Math.max(
            minBound,
            Math.min(maxBound, newValue),
        );

        const updatedThresholds = thresholds.map((threshold) =>
            threshold.id === id
                ? { ...threshold, value: constrainedValue }
                : threshold,
        );

        setThresholds(updatedThresholds);
        onThresholdsChange?.(
            updatedThresholds.map((t) => t.value).sort((a, b) => a - b),
        );
    };

    const handleMouseDown = (id: number) => {
        setDraggingId(id);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (draggingId === null || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        const roundedPercentage = Math.round(percentage);
        handleThresholdChange(draggingId, roundedPercentage);
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    useEffect(() => {
        if (draggingId !== null) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [draggingId]);

    // Sort thresholds ascending
    const sortedThresholds = [...thresholds].sort((a, b) => a.value - b.value);

    const getGradientSegments = () => {
        const segments: string[] = [];

        // Level 1 (Purple) from 0% to first threshold
        segments.push(`${liqLevels[3].color} 0%`);
        segments.push(`${liqLevels[3].color} ${sortedThresholds[0].value}%`);

        // Level 2 (Blue) from first to second threshold
        segments.push(`${liqLevels[2].color} ${sortedThresholds[0].value}%`);
        segments.push(`${liqLevels[2].color} ${sortedThresholds[1].value}%`);

        // Level 3 (Green) from second to third threshold
        segments.push(`${liqLevels[1].color} ${sortedThresholds[1].value}%`);
        segments.push(`${liqLevels[1].color} ${sortedThresholds[2].value}%`);

        // Level 4 (Yellow) from third threshold to 100%
        segments.push(`${liqLevels[0].color} ${sortedThresholds[2].value}%`);
        segments.push(`${liqLevels[0].color} 100%`);

        return segments.join(', ');
    };

    const getValueForRatio = (ratio: number) => {
        if (minLiqValue === null || maxLiqValue === null) return 0;
        return formatNum(
            (minLiqValue + ((maxLiqValue - minLiqValue) * ratio) / 100).toFixed(
                2,
            ),
        );
    };

    // Get level ranges for display
    const getLevelRanges = () => {
        const sorted = sortedThresholds.map((t) => t.value);
        return [
            {
                level: liqLevels[3],
                range: `Min - ${getValueForRatio(sorted[0])}`,
            },
            {
                level: liqLevels[2],
                range: `${getValueForRatio(sorted[0])} - ${getValueForRatio(sorted[1])}`,
            },
            {
                level: liqLevels[1],
                range: `${getValueForRatio(sorted[1])} - ${getValueForRatio(sorted[2])}`,
            },
            {
                level: liqLevels[0],
                range: `${getValueForRatio(sorted[2])} - Max`,
            },
        ];
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Liquidation Levels</h3>
                <button className={styles.resetButton} onClick={handleReset}>
                    Reset
                </button>
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
                    {sortedThresholds.map((threshold, index) => {
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
                            <div
                                key={threshold.id}
                                className={styles.thumb}
                                style={
                                    {
                                        left: `${threshold.value}%`,
                                        '--gradient-left': leftColor,
                                        '--gradient-right': rightColor,
                                    } as React.CSSProperties
                                }
                                onMouseDown={() =>
                                    handleMouseDown(threshold.id)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
