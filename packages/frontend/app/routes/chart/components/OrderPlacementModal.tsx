import { useState } from 'react';
import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';

interface OrderPlacementModalProps {
    price: number;
    side: 'buy' | 'sell';
    symbol?: string;
    onClose: () => void;
    onConfirm: (price: number, amount: number) => void;
}

export const OrderPlacementModal: React.FC<OrderPlacementModalProps> = ({
    price,
    side,
    symbol = 'USD',
    onClose,
    onConfirm,
}) => {
    const [amount, setAmount] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>(price.toFixed(2));
    const [cancelHovered, setCancelHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

    const handleConfirm = () => {
        const parsedAmount = parseFloat(amount);
        const parsedPrice = parseFloat(limitPrice);

        if (parsedAmount > 0 && parsedPrice > 0) {
            onConfirm(parsedPrice, parsedAmount);
            onClose();
        }
    };

    const isConfirmDisabled =
        !amount ||
        !limitPrice ||
        parseFloat(amount) <= 0 ||
        parseFloat(limitPrice) <= 0;

    return (
        <>
            <style>
                {`
                    .order-placement-input .numFormattedInput {
                        background: transparent !important;
                        border: none !important;
                        color: #cbcaca !important;
                        font-size: 12px !important;
                        outline: none !important;
                        text-align: right !important;
                        font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif !important;
                        width: 100% !important;
                        cursor: text !important;
                    }
                `}
            </style>
            <div
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10000,
                    backgroundColor: '#0e0e14',
                    minWidth: '320px',
                    boxShadow: '0 2px 4px #0006',
                    boxSizing: 'border-box',
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title */}
                <div
                    style={{
                        height: '48px',
                        padding: '0 16px',
                        display: 'flex',
                        alignItems: 'center',
                        borderBottom: '1px solid #313030',
                    }}
                >
                    <span
                        style={{
                            color: '#cbcaca',
                            fontSize: '16px',
                            fontWeight: 500,
                        }}
                    >
                        {side === 'buy' ? 'Buy' : 'Sell'} Limit Order
                    </span>
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                    {/* Price Field */}
                    <div
                        style={{
                            height: '32px',
                            padding: '8px 12px',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '8px',
                            backgroundColor: '#1c1c22',
                            marginBottom: '8px',
                        }}
                    >
                        <span
                            style={{
                                color: '#767676',
                                fontSize: '12px',
                            }}
                        >
                            Price
                        </span>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <NumFormattedInput
                                value={limitPrice}
                                onChange={(e) => {
                                    const newValue =
                                        typeof e === 'string'
                                            ? e
                                            : e.target.value;
                                    setLimitPrice(newValue);
                                }}
                                className='order-placement-input'
                            />
                        </div>
                        <span
                            style={{
                                color: '#767676',
                                fontSize: '12px',
                            }}
                        >
                            USD
                        </span>
                    </div>

                    {/* Amount Field */}
                    <div
                        style={{
                            height: '32px',
                            padding: '8px 12px',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '8px',
                            backgroundColor: '#1c1c22',
                            marginBottom: '16px',
                        }}
                    >
                        <span
                            style={{
                                color: '#767676',
                                fontSize: '12px',
                            }}
                        >
                            Size
                        </span>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <NumFormattedInput
                                value={amount}
                                onChange={(e) => {
                                    const newValue =
                                        typeof e === 'string'
                                            ? e
                                            : e.target.value;
                                    setAmount(newValue);
                                }}
                                placeholder='Enter Size'
                                autoFocus
                                className='order-placement-input'
                            />
                        </div>
                        <span
                            style={{
                                color: '#767676',
                                fontSize: '12px',
                            }}
                        >
                            USD
                        </span>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                            style={{
                                flex: 1,
                                height: '40px',
                                padding: '0 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                backgroundColor: cancelHovered
                                    ? '#2a2d35'
                                    : '#1e2127',
                                borderRadius: '4px',
                                transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={() => setCancelHovered(true)}
                            onMouseLeave={() => setCancelHovered(false)}
                            onClick={onClose}
                        >
                            <span
                                style={{
                                    color: '#cbcaca',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }}
                            >
                                Cancel
                            </span>
                        </div>
                        <div
                            style={{
                                flex: 1,
                                height: '40px',
                                padding: '0 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isConfirmDisabled
                                    ? 'not-allowed'
                                    : 'pointer',
                                backgroundColor: isConfirmDisabled
                                    ? '#1a1a1a'
                                    : side === 'buy'
                                      ? confirmHovered
                                          ? '#1a9b7a'
                                          : '#16a085'
                                      : confirmHovered
                                        ? '#c44444'
                                        : '#d9534f',
                                borderRadius: '4px',
                                transition: 'background-color 0.15s',
                                opacity: isConfirmDisabled ? 0.5 : 1,
                            }}
                            onMouseEnter={() => setConfirmHovered(true)}
                            onMouseLeave={() => setConfirmHovered(false)}
                            onClick={
                                isConfirmDisabled ? undefined : handleConfirm
                            }
                        >
                            <span
                                style={{
                                    color: isConfirmDisabled
                                        ? '#525050'
                                        : '#ffffff',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                            >
                                {side === 'buy' ? 'Buy / Long' : 'Sell / Short'}
                            </span>
                        </div>
                    </div>
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
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
                onClick={onClose}
            />
        </>
    );
};
