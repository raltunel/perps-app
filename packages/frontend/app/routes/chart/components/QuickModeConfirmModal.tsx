import { useState } from 'react';
import {
    isEstablished,
    SessionButton,
    useSession,
} from '@fogo/sessions-sdk-react';
import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';

interface QuickModeConfirmModalProps {
    onClose: () => void;
    onConfirm: (amount: number) => void;
}

export const QuickModeConfirmModal: React.FC<QuickModeConfirmModalProps> = ({
    onClose,
    onConfirm,
}) => {
    const session = useSession();
    const isSessionEstablished = isEstablished(session);
    const [amount, setAmount] = useState<string>('');
    const [cancelHovered, setCancelHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

    const handleConfirm = () => {
        const parsedAmount = parseFloat(amount);
        if (parsedAmount > 0) {
            onConfirm(parsedAmount);
            onClose();
        }
    };

    const isConfirmDisabled = !amount || parseFloat(amount) <= 0;

    return (
        <>
            <style>
                {`
                    .quick-mode-input .numFormattedInput {
                        background: transparent !important;
                        border: none !important;
                        color: #cbcaca !important;
                        font-size: 13px !important;
                        outline: none !important;
                        text-align: right !important;
                        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif !important;
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
                    backgroundColor: '#1e1e1e',
                    borderRadius: '12px',
                    width: '340px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    boxSizing: 'border-box',
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                    padding: '20px',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon and Title */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '16px',
                    }}
                >
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <span style={{ fontSize: '18px', color: '#ffffff' }}>
                            !
                        </span>
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3
                            style={{
                                margin: 0,
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: '6px',
                            }}
                        >
                            Enable Quick Mode?
                        </h3>
                        <p
                            style={{
                                margin: 0,
                                color: '#b3b3b3',
                                fontSize: '13px',
                                lineHeight: '1.4',
                            }}
                        >
                            Place orders instantly using your predefined amount.
                        </p>
                    </div>
                </div>

                {/* Input Fields */}
                <div style={{ marginBottom: '16px' }}>
                    {/* Size Field */}
                    <div
                        style={{
                            height: '36px',
                            padding: '0 12px',
                            display: 'grid',
                            gridTemplateColumns: 'auto 1fr auto',
                            alignItems: 'center',
                            gap: '8px',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            marginBottom: '12px',
                        }}
                    >
                        <span
                            style={{
                                color: '#b3b3b3',
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
                                className='quick-mode-input'
                            />
                        </div>
                        <span
                            style={{
                                color: '#b3b3b3',
                                fontSize: '12px',
                            }}
                        >
                            USD
                        </span>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        style={{
                            flex: 1,
                            height: '36px',
                            padding: '0 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backgroundColor: cancelHovered
                                ? '#2a2a2a'
                                : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            transition: 'background-color 0.15s',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 500,
                            fontFamily:
                                '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                        }}
                        onMouseEnter={() => setCancelHovered(true)}
                        onMouseLeave={() => setCancelHovered(false)}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    {!isSessionEstablished ? (
                        <div
                            style={{
                                flex: 1,
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            className='plausible-event-name=Login+Button+Click plausible-event-buttonLocation=Quick+Mode+Modal'
                        >
                            <SessionButton />
                        </div>
                    ) : (
                        <button
                            style={{
                                flex: 1,
                                height: '36px',
                                padding: '0 16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: isConfirmDisabled
                                    ? 'not-allowed'
                                    : 'pointer',
                                backgroundColor: isConfirmDisabled
                                    ? '#3a3a3a'
                                    : confirmHovered
                                      ? 'var(--accent1, #5294e2)'
                                      : 'var(--accent1, #4a8bd3)',
                                border: 'none',
                                borderRadius: '6px',
                                transition: 'background-color 0.15s',
                                color: isConfirmDisabled
                                    ? '#888888'
                                    : '#ffffff',
                                fontSize: '13px',
                                fontWeight: 600,
                                fontFamily:
                                    '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                                opacity: isConfirmDisabled ? 0.5 : 1,
                            }}
                            onMouseEnter={() => setConfirmHovered(true)}
                            onMouseLeave={() => setConfirmHovered(false)}
                            onClick={
                                isConfirmDisabled ? undefined : handleConfirm
                            }
                            disabled={isConfirmDisabled}
                        >
                            Enable Quick Mode
                        </button>
                    )}
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
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                }}
                onClick={onClose}
            />
        </>
    );
};
