import React, { useState } from 'react';

interface PriceActionDropdownProps {
    position: {
        x: number;
        y: number;
        price: number;
    };
    symbolCoin?: string;
    onClose: () => void;
    onBuyLimit: (price: number) => void;
    onSellStop: (price: number) => void;
}

const PriceActionDropdown: React.FC<PriceActionDropdownProps> = ({
    position,
    symbolCoin,
    onClose,
    onBuyLimit,
    onSellStop,
}) => {
    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    left: position.x,
                    top: position.y,
                    zIndex: 10000,
                    backgroundColor: '#232323ff',
                    borderRadius: '6px',
                    minWidth: '280px',
                    boxShadow:
                        '0 2px 4px var(--color-shadow-primary-neutral-extra-heavy)',
                    boxSizing: 'border-box',
                    textAlign: 'left',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: '8px 0' }}>
                    <MenuItem
                        label={`Buy 1 ${symbolCoin || ''} @ ${position.price.toFixed(2)} limit`}
                        shortcut='Alt + Shift + B'
                        onClick={() => {
                            onBuyLimit(position.price);
                            onClose();
                        }}
                    />

                    <MenuItem
                        label={`Sell 1 ${symbolCoin || ''} @ ${position.price.toFixed(2)} stop`}
                        onClick={() => {
                            onSellStop(position.price);
                            onClose();
                        }}
                    />
                </div>
            </div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                }}
                onClick={onClose}
            />
        </>
    );
};

const MenuItem: React.FC<{
    label: string;
    shortcut?: string;
    onClick: () => void;
}> = ({ label, shortcut, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                backgroundColor: isHovered ? '#2a2a2a' : 'transparent',
                transition: 'background-color 0.15s',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <span
                style={{
                    flex: 1,
                    color: '#e0e0e0',
                    fontSize: '13px',
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
            >
                {label}
            </span>
            {shortcut && (
                <span
                    style={{
                        color: '#666',
                        fontSize: '11px',
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    {shortcut}
                </span>
            )}
        </div>
    );
};

export default PriceActionDropdown;
