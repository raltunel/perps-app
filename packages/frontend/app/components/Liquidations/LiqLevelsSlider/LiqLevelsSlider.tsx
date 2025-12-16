import { useState, useRef, useEffect } from 'react';
import styles from './LiqLevelsSlider.module.css';

interface LiqLevel {
    id: number;
    label: string;
    color: string;
}

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
    // 4 levels defined by their colors
    const levels: LiqLevel[] = [
        { id: 1, label: 'Level 4', color: '#FDE725' }, // Yellow - highest
        { id: 2, label: 'Level 3', color: '#2BAE7D' }, // Green
        { id: 3, label: 'Level 2', color: '#287D8D' }, // Blue
        { id: 4, label: 'Level 1', color: '#461668' }, // Purple - lowest
    ];

    // Default threshold values
    const defaultThresholds: LiqThreshold[] = [
        { id: 1, value: 50 },
        { id: 2, value: 70 },
        { id: 3, value: 80 },
    ];

    // 3 thresholds to create 4 sections
    const [thresholds, setThresholds] =
        useState<LiqThreshold[]>(defaultThresholds);

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
        segments.push(`${levels[3].color} 0%`);
        segments.push(`${levels[3].color} ${sortedThresholds[0].value}%`);

        // Level 2 (Blue) from first to second threshold
        segments.push(`${levels[2].color} ${sortedThresholds[0].value}%`);
        segments.push(`${levels[2].color} ${sortedThresholds[1].value}%`);

        // Level 3 (Green) from second to third threshold
        segments.push(`${levels[1].color} ${sortedThresholds[1].value}%`);
        segments.push(`${levels[1].color} ${sortedThresholds[2].value}%`);

        // Level 4 (Yellow) from third threshold to 100%
        segments.push(`${levels[0].color} ${sortedThresholds[2].value}%`);
        segments.push(`${levels[0].color} 100%`);

        return segments.join(', ');
    };

    // Get level ranges for display
    const getLevelRanges = () => {
        const sorted = sortedThresholds.map((t) => t.value);
        return [
            { level: levels[3], range: `0-${sorted[0]}` },
            { level: levels[2], range: `${sorted[0]}-${sorted[1]}` },
            { level: levels[1], range: `${sorted[1]}-${sorted[2]}` },
            { level: levels[0], range: `${sorted[2]}-100` },
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
                                ? levels[3].color
                                : index === 1
                                  ? levels[2].color
                                  : levels[1].color;
                        const rightColor =
                            index === 0
                                ? levels[2].color
                                : index === 1
                                  ? levels[1].color
                                  : levels[0].color;

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
