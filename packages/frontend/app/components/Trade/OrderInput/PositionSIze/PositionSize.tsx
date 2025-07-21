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
    // Step increment for final values and rounding
    DRAG_STEP: 5,

    // Minimum and maximum values
    MIN_VALUE: 0,
    MAX_VALUE: 100,

    // Snap tolerance for clicking near markers (percentage)
    MARKER_SNAP_TOLERANCE: 7.5,

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
    const [inputValue, setInputValue] = useState<string>(value.toString());
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [showLabels] = useState(POSITION_SIZE_UI_CONFIG.DEFAULT_SHOW_LABELS);
    const [dragPosition, setDragPosition] = useState<number | null>(null); // Smooth drag position

    const sliderRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

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
            const clampedPercentage = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, percentage),
            );

            // Update smooth drag position for immediate visual feedback
            setDragPosition(clampedPercentage);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !sliderRef.current || !e.touches[0]) return;

            const percentage = getPercentageFromPosition(e.touches[0].clientX);
            const clampedPercentage = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, percentage),
            );

            // Update smooth drag position for immediate visual feedback
            setDragPosition(clampedPercentage);

            // Prevent scrolling while dragging
            e.preventDefault();
        };

        const handleMouseUp = () => {
            if (dragPosition !== null) {
                // Round to nearest DRAG_STEP increment when releasing
                const snappedValue =
                    Math.round(dragPosition / POSITION_SIZE_CONFIG.DRAG_STEP) *
                    POSITION_SIZE_CONFIG.DRAG_STEP;
                const clampedValue = Math.max(
                    POSITION_SIZE_CONFIG.MIN_VALUE,
                    Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, snappedValue),
                );

                if (clampedValue !== value) {
                    onChange(clampedValue);
                }
            }

            setIsDragging(false);
            setDragPosition(null); // Clear drag position when dragging ends
        };

        const handleTouchEnd = () => {
            if (dragPosition !== null) {
                // Round to nearest DRAG_STEP increment when releasing
                const snappedValue =
                    Math.round(dragPosition / POSITION_SIZE_CONFIG.DRAG_STEP) *
                    POSITION_SIZE_CONFIG.DRAG_STEP;
                const clampedValue = Math.max(
                    POSITION_SIZE_CONFIG.MIN_VALUE,
                    Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, snappedValue),
                );

                if (clampedValue !== value) {
                    onChange(clampedValue);
                }
            }

            setIsDragging(false);
            setDragPosition(null); // Clear drag position when dragging ends
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
    }, [isDragging, dragPosition, value, onChange]);

    const handleKnobMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        // Initialize drag position with current value
        setDragPosition(value);
    };

    const handleTrackMouseMove = (e: React.MouseEvent) => {
        if (!sliderRef.current || isDragging) return;

        // For hover effects, still show rounded values
    };

    const handleTrackMouseLeave = () => {
        // Clear hover effects if any
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
            onChange(closestMarker.value);
        } else {
            // Round to nearest step increment
            const newValue =
                Math.round(percentage / POSITION_SIZE_CONFIG.DRAG_STEP) *
                POSITION_SIZE_CONFIG.DRAG_STEP;
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, newValue),
            );
            onChange(clampedValue);
        }
    };

    // Get position for the knob as percentage
    const getKnobPosition = () => {
        // Use smooth drag position during dragging, otherwise use the actual value
        return isDragging && dragPosition !== null ? dragPosition : value;
    };

    // Get the display value - show smooth position during drag, snapped value otherwise
    const getDisplayValue = () => {
        if (isDragging && dragPosition !== null) {
            // During dragging, show the value that it will snap to
            const snappedValue =
                Math.round(dragPosition / POSITION_SIZE_CONFIG.DRAG_STEP) *
                POSITION_SIZE_CONFIG.DRAG_STEP;
            return Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, snappedValue),
            );
        }
        return value;
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle input blur (when user finishes typing)
    const handleInputBlur = () => {
        const newValue = parseInt(inputValue, 10);
        if (!isNaN(newValue)) {
            // Round to nearest DRAG_STEP and clamp between min/max
            const roundedValue =
                Math.round(newValue / POSITION_SIZE_CONFIG.DRAG_STEP) *
                POSITION_SIZE_CONFIG.DRAG_STEP;
            const clampedValue = Math.max(
                POSITION_SIZE_CONFIG.MIN_VALUE,
                Math.min(POSITION_SIZE_CONFIG.MAX_VALUE, roundedValue),
            );
            onChange(clampedValue);
        } else {
            // Reset to current value if invalid
            setInputValue(value.toString());
        }
    };

    // Handle Enter key in input
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };

    return (
        <div className={`${styles.positionSliderContainer} ${className} `}>
            <div className={styles.sliderWithValue}>
                <div className={styles.sliderContainer}>
                    <div
                        ref={sliderRef}
                        className={styles.sliderTrack}
                        onClick={handleTrackClick}
                        onMouseMove={handleTrackMouseMove}
                        onMouseLeave={handleTrackMouseLeave}
                    >
                        {/* Gray background track */}
                        <div className={styles.sliderBackground}></div>

                        {/* Colored active track - uses smooth position during drag */}
                        <div
                            className={styles.sliderActive}
                            style={{
                                width: `${getKnobPosition()}%`,
                                // background: `linear-gradient(to right, ${colors['1']}, ${colors['5']}, ${colors['10']}, ${colors['50']}, ${colors['100']})`
                            }}
                        ></div>

                        {/* Slider markers - only show visual markers */}
                        {POSITION_SIZE_CONFIG.VISUAL_MARKERS.map(
                            (marker: SizeOption) => (
                                <div
                                    key={marker.value}
                                    className={`${styles.sliderMarker} ${
                                        marker.value <= getKnobPosition()
                                            ? styles.active
                                            : ''
                                    } ${
                                        marker.value === value
                                            ? styles.sliderMarkerCurrent
                                            : ''
                                    }`}
                                    style={{
                                        left: `${marker.value}%`,
                                        borderColor:
                                            marker.value <= getKnobPosition()
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
                                left: `${getKnobPosition()}%`,
                                // borderColor: getKnobColor(),
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
                                                marker.value <=
                                                getKnobPosition()
                                                    ? POSITION_SIZE_UI_CONFIG.ACTIVE_LABEL_COLOR
                                                    : POSITION_SIZE_UI_CONFIG.INACTIVE_LABEL_COLOR,
                                        }}
                                        onClick={() => onChange(marker.value)}
                                    >
                                        {marker.label}
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>

                {/* Current value display with input - shows the snapped value during drag */}
                <div className={styles.valueDisplay}>
                    <input
                        type='text'
                        value={
                            isDragging
                                ? getDisplayValue().toString()
                                : inputValue
                        }
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
