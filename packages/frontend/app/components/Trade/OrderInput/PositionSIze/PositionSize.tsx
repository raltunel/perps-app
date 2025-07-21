import React, { useEffect, useRef, useState } from 'react';
import styles from './PositionSize.module.css';

interface SizeOption {
    value: number;
    label: string;
}

interface PositionSizeProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
}

const POSITION_SIZE_CONFIG = {
    // Minimum and maximum values
    MIN_VALUE: 0,
    MAX_VALUE: 100,

    // Snap tolerance for clicking near markers (percentage)
    MARKER_SNAP_TOLERANCE: 2.5,

    // Visual markers for the slider
    VISUAL_MARKERS: [
        { value: 0, label: '0%' },
        { value: 25, label: '25%' },
        { value: 50, label: '50%' },
        { value: 75, label: '75%' },
        { value: 100, label: '100%' },
    ],
} as const;

const POSITION_SIZE_UI_CONFIG = {
    // Color values
    ACTIVE_LABEL_COLOR: '#FFFFFF',
    INACTIVE_LABEL_COLOR: '#808080',
    TEXT_COLOR: 'var(--text1)',
    ACCENT_COLOR: 'var(--accent1)',

    // Default show labels state
    DEFAULT_SHOW_LABELS: false,
} as const;

export default function PositionSize({
    value = 0,
    onChange,
    className = '',
}: PositionSizeProps) {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [showLabels] = useState(POSITION_SIZE_UI_CONFIG.DEFAULT_SHOW_LABELS);
    const [currentValue, setCurrentValue] = useState<number>(value);

    const sliderRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    // Update internal value when prop changes (but not during drag)
    useEffect(() => {
        if (!isDragging) {
            setCurrentValue(value);
        }
    }, [value, isDragging]);

    // Get percentage from mouse position
    const getPercentageFromPosition = (clientX: number) => {
        if (!sliderRef.current) return 0;

        const rect = sliderRef.current.getBoundingClientRect();
        const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
        return (offsetX / rect.width) * 100;
    };

    // Handle dragging functionality
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !sliderRef.current) return;

            const percentage = getPercentageFromPosition(e.clientX);

            // Clamp to min/max - NO ROUNDING AT ALL
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, percentage),
            );

            // Update internal value immediately for smooth visual feedback
            setCurrentValue(clampedValue);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !sliderRef.current || !e.touches[0]) return;

            const percentage = getPercentageFromPosition(e.touches[0].clientX);

            // Clamp to min/max - NO ROUNDING AT ALL
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, percentage),
            );

            // Update internal value immediately for smooth visual feedback
            setCurrentValue(clampedValue);

            // Prevent scrolling while dragging
            e.preventDefault();
        };

        const handleMouseUp = () => {
            const snappedValue = Math.floor(currentValue / 5) * 5;
            setCurrentValue(snappedValue);
            onChange(snappedValue);
            setIsDragging(false);
        };

        const handleTouchEnd = () => {
            const snappedValue = Math.floor(currentValue / 5) * 5;
            setCurrentValue(snappedValue);
            onChange(snappedValue);
            setIsDragging(false);
        };

        if (isDragging) {
            // Mouse events
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Touch events
            document.addEventListener('touchmove', handleTouchMove, {
                passive: false,
            });
            document.addEventListener('touchend', handleTouchEnd);
            document.addEventListener('touchcancel', handleTouchEnd);
        }

        return () => {
            // Clean up all event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isDragging, currentValue, onChange]);

    const handleKnobMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleTrackClick = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;

        const percentage = getPercentageFromPosition(e.clientX);

        // For track clicks, snap to visual markers if we're close to them
        const closestMarker = POSITION_SIZE_CONFIG.VISUAL_MARKERS.reduce(
            (prev, curr) =>
                Math.abs(curr.value - percentage) <
                Math.abs(prev.value - percentage)
                    ? curr
                    : prev,
        );

        // Check if we're within snap tolerance to make it easier to hit markers
        const distanceToMarker = Math.abs(closestMarker.value - percentage);
        if (distanceToMarker <= POSITION_SIZE_CONFIG.MARKER_SNAP_TOLERANCE) {
            const newValue = closestMarker.value;
            setCurrentValue(newValue);
            onChange(newValue);
        } else {
            // For clicks not near markers, use the exact percentage
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, percentage),
            );
            setCurrentValue(clampedValue);
            onChange(clampedValue);
        }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, newValue),
            );
            setCurrentValue(clampedValue);
        }
    };

    // Handle input blur (when user finishes typing)
    const handleInputBlur = () => {
        onChange(currentValue);
    };

    // Handle Enter key in input
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    // Format the display value to show last reached 5% increment
    const formatDisplayValue = (val: number) => {
        return Math.floor(val / 5) * 5;
    };

    return (
        <div className={`${styles.positionSliderContainer} ${className} `}>
            <div className={styles.sliderWithValue}>
                <div className={styles.sliderContainer}>
                    <div
                        ref={sliderRef}
                        className={styles.sliderTrack}
                        onClick={handleTrackClick}
                    >
                        {/* Gray background track */}
                        <div className={styles.sliderBackground}></div>

                        {/* Colored active track */}
                        <div
                            className={styles.sliderActive}
                            style={{
                                width: `${currentValue}%`,
                                transition: isDragging ? 'none' : undefined,
                            }}
                        ></div>

                        {/* Slider markers */}
                        {POSITION_SIZE_CONFIG.VISUAL_MARKERS.map(
                            (marker: SizeOption) => (
                                <div
                                    key={marker.value}
                                    className={`${styles.sliderMarker} ${
                                        marker.value <= currentValue
                                            ? styles.active
                                            : ''
                                    }`}
                                    style={{
                                        left: `${marker.value}%`,
                                        borderColor:
                                            marker.value <= currentValue
                                                ? 'transparent'
                                                : POSITION_SIZE_UI_CONFIG.ACCENT_COLOR,
                                    }}
                                ></div>
                            ),
                        )}

                        {/* Draggable knob */}
                        <div
                            ref={knobRef}
                            className={styles.sliderKnob}
                            style={{
                                left: `${currentValue}%`,
                                transition: isDragging ? 'none' : undefined,
                            }}
                            onMouseDown={handleKnobMouseDown}
                            onTouchStart={handleKnobMouseDown}
                        ></div>
                    </div>

                    {showLabels && (
                        <div className={styles.labelContainer}>
                            {POSITION_SIZE_CONFIG.VISUAL_MARKERS.map(
                                (marker: SizeOption) => (
                                    <div
                                        key={marker.value}
                                        className={styles.valueLabel}
                                        style={{
                                            left: `${marker.value}%`,
                                            color:
                                                marker.value <= currentValue
                                                    ? POSITION_SIZE_UI_CONFIG.ACTIVE_LABEL_COLOR
                                                    : POSITION_SIZE_UI_CONFIG.INACTIVE_LABEL_COLOR,
                                        }}
                                        onClick={() => {
                                            setCurrentValue(marker.value);
                                            onChange(marker.value);
                                        }}
                                    >
                                        {marker.label}
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>

                {/* Current value display with input  */}
                <div className={styles.valueDisplay}>
                    <input
                        type='text'
                        value={formatDisplayValue(currentValue).toString()}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        className={styles.valueInput}
                        aria-label='Position size value'
                        style={{
                            color: POSITION_SIZE_UI_CONFIG.TEXT_COLOR,
                        }}
                    />
                    <span
                        className={styles.valueSuffix}
                        style={{
                            color: POSITION_SIZE_UI_CONFIG.TEXT_COLOR,
                        }}
                    >
                        %
                    </span>
                </div>
            </div>
        </div>
    );
}
