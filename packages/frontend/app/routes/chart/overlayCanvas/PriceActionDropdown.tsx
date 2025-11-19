import React, { useState } from 'react';

interface PriceActionDropdownProps {
    position: {
        x: number;
        y: number;
        price: number;
    };
    symbolCoin?: string;
    markPx?: number;
    onClose: () => void;
    onBuyLimit: (price: number) => void;
    onSellStop: (price: number) => void;
}

const PriceActionDropdown: React.FC<PriceActionDropdownProps> = ({
    position,
    symbolCoin,
    markPx,
    onClose,
    onBuyLimit,
    onSellStop,
}) => {
    const showBuyShortcut = markPx !== undefined && position.price < markPx;
    const showSellShortcut = markPx !== undefined && position.price > markPx;

    const menuItems = [
        {
            label: `Buy 1 ${symbolCoin || ''} @ ${position.price.toFixed(2)} limit`,
            shortcut: showBuyShortcut ? 'Alt + Shift + B' : undefined,
            onClick: () => {
                onBuyLimit(position.price);
                onClose();
            },
            priority: showBuyShortcut ? 1 : 2,
        },
        {
            label: `Sell 1 ${symbolCoin || ''} @ ${position.price.toFixed(2)} stop`,
            shortcut: showSellShortcut ? 'Alt + Shift + S' : undefined,
            onClick: () => {
                onSellStop(position.price);
                onClose();
            },
            priority: showSellShortcut ? 1 : 2,
        },
    ].sort((a, b) => a.priority - b.priority);

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
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            label={item.label}
                            shortcut={item.shortcut}
                            onClick={item.onClick}
                        />
                    ))}
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
                }}
            >
                {label}
            </span>
            {shortcut && (
                <span
                    style={{
                        color: '#666',
                        fontSize: '11px',
                    }}
                >
                    {shortcut}
                </span>
            )}
        </div>
    );
};

export default PriceActionDropdown;
