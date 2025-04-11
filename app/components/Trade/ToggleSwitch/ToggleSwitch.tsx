import React from 'react';
import styles from './ToggleSwitch.module.css';

export interface ToggleSwitchProps {
    isOn: boolean;
    onToggle: (newState?: boolean) => void;
    label?: string;
    hideLabel?: boolean;
}

export default function ToggleSwitch(props: ToggleSwitchProps) {
    const {
        isOn,
        onToggle,
        label = 'Hide Small Balances',
        hideLabel = false,
    } = props;

    const handleToggle = () => {
        onToggle(!isOn);
    };

    return (
        <div className={styles.toggleContainer}>
            {!hideLabel && label && (
                <span className={styles.toggleLabel}>{label}</span>
            )}
            <div
                className={`${styles.toggleSwitch} ${
                    isOn ? styles.toggleSwitchOn : ''
                }`}
                onClick={handleToggle}
                role='switch'
                aria-checked={isOn}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleToggle();
                        e.preventDefault();
                    }
                }}
            />
        </div>
    );
}
