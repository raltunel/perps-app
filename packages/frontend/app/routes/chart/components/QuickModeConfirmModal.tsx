import { useState } from 'react';
import {
    isEstablished,
    SessionButton,
    useSession,
} from '@fogo/sessions-sdk-react';
import NumFormattedInput from '~/components/Inputs/NumFormattedInput/NumFormattedInput';
import { useTradeDataStore } from '~/stores/TradeDataStore';

export type TradeType = 'Market' | 'Limit';

interface QuickModeConfirmModalProps {
    onClose: () => void;
    onConfirm: (data: {
        amount: number;
        tradeType: TradeType;
        denom: string;
        saveAsDefault: boolean;
    }) => void;
}

export const QuickModeConfirmModal: React.FC<QuickModeConfirmModalProps> = ({
    onClose,
    onConfirm,
}) => {
    const session = useSession();
    const isSessionEstablished = isEstablished(session);

    const { symbol } = useTradeDataStore();
    const upperSymbol = symbol?.toUpperCase() ?? 'BTC';

    const [amount, setAmount] = useState<string>('');
    const [tradeType, setTradeType] = useState<TradeType>('Limit');
    const [denom, setDenom] = useState<'USD' | string>(upperSymbol);

    const [dropdownTradeOpen, setDropdownTradeOpen] = useState(false);
    const [dropdownDenomOpen, setDropdownDenomOpen] = useState(false);
    const [saveAsDefault, setSaveAsDefault] = useState(false);

    const [cancelHovered, setCancelHovered] = useState(false);
    const [saveHovered, setSaveHovered] = useState(false);
    const [confirmHovered, setConfirmHovered] = useState(false);

    const isDisabled = !amount || parseFloat(amount) <= 0;

    const tradeTypes: TradeType[] = ['Limit', 'Market'];

    const handleConfirm = () => {
        const parsed = parseFloat(amount);
        if (parsed > 0) {
            onConfirm({
                amount: parsed,
                tradeType,
                denom,
                saveAsDefault,
            });
            onClose();
        }
    };

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
                        width: 100% !important;
                        cursor: text !important;
                    }

                    /* size input padding fix */
                    .size-input-padding .numFormattedInput {
                        padding-right: 60px !important;
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
                    borderRadius: 12,
                    width: 340,
                    padding: 20,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span style={{ color: '#fff', fontSize: 18 }}>!</span>
                    </div>

                    <div>
                        <h3
                            style={{
                                margin: 0,
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 600,
                                marginBottom: 4,
                            }}
                        >
                            Quick Mode Settings
                        </h3>
                    </div>
                </div>

                <div style={{ marginBottom: 12, position: 'relative' }}>
                    <button
                        onClick={() => setDropdownTradeOpen(!dropdownTradeOpen)}
                        style={{
                            width: '100%',
                            height: 36,
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 6,
                            color: '#cbcaca',
                            fontSize: 13,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 12px',
                            cursor: 'pointer',
                        }}
                    >
                        {tradeType}
                        <span style={{ fontSize: 10 }}>▼</span>
                    </button>

                    {dropdownTradeOpen && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 40,
                                left: 0,
                                width: '100%',
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 6,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                zIndex: 10001,
                            }}
                        >
                            {tradeTypes.map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setTradeType(type);
                                        setDropdownTradeOpen(false);
                                    }}
                                    style={{
                                        padding: '8px 12px',
                                        color: '#cbcaca',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgb(45,44,44)',
                                        fontSize: 13,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            'rgb(30,30,30)')
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            'rgb(45,44,44)')
                                    }
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SIZE + DENOM */}
                <div
                    style={{
                        height: 36,
                        padding: '0 12px',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        alignItems: 'center',
                        borderRadius: 6,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        marginBottom: 18,
                        position: 'relative',
                    }}
                >
                    <span style={{ fontSize: 12, color: '#b3b3b3' }}>Size</span>

                    <div style={{ position: 'relative', width: '100%' }}>
                        <NumFormattedInput
                            value={amount}
                            onChange={(e) =>
                                setAmount(
                                    typeof e === 'string' ? e : e.target.value,
                                )
                            }
                            placeholder='Enter Size'
                            className='quick-mode-input size-input-padding'
                        />
                    </div>

                    {/* DENOM DROPDOWN */}
                    <div style={{ width: 60, position: 'relative' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropdownDenomOpen(!dropdownDenomOpen);
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#cbcaca',
                                fontSize: 12,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: 0,
                                width: '100%',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {denom}
                            <span style={{ fontSize: 10, opacity: 0.8 }}>
                                ▼
                            </span>
                        </button>

                        {dropdownDenomOpen && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 28,
                                    right: 0,
                                    backgroundColor: 'rgb(45,44,44)',
                                    borderRadius: 6,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                                    width: 80,
                                    padding: '4px 0',
                                    zIndex: 10001,
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {[upperSymbol, 'USD'].map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => {
                                            setDenom(opt);
                                            setDropdownDenomOpen(false);
                                        }}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: 12,
                                            cursor: 'pointer',
                                            backgroundColor: 'rgb(45,44,44)',
                                            color: '#cbcaca',
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                'rgb(30,30,30)')
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                                'rgb(45,44,44)')
                                        }
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div
                    onClick={() => setSaveAsDefault(!saveAsDefault)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 18,
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    <input
                        type='checkbox'
                        checked={saveAsDefault}
                        onChange={() => setSaveAsDefault(!saveAsDefault)}
                        style={{ cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: 12, color: '#b3b3b3' }}>
                        Save as default for Quick Mode
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        style={{
                            flex: 1,
                            height: 36,
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: cancelHovered
                                ? '#2a2a2a'
                                : 'transparent',
                            color: '#fff',
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
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <SessionButton />
                        </div>
                    ) : (
                        <>
                            <button
                                style={{
                                    flex: 1,
                                    height: 36,
                                    borderRadius: 6,
                                    border: 'none',
                                    cursor: isDisabled
                                        ? 'not-allowed'
                                        : 'pointer',
                                    backgroundColor: saveHovered
                                        ? '#4a5060'
                                        : '#3a3a3a',
                                    opacity: isDisabled ? 0.4 : 1,
                                    color: '#fff',
                                }}
                                disabled={isDisabled}
                                onMouseEnter={() => setSaveHovered(true)}
                                onMouseLeave={() => setSaveHovered(false)}
                                onClick={() => {
                                    if (!isDisabled) {
                                        onConfirm({
                                            amount: parseFloat(amount),
                                            tradeType,
                                            denom,
                                            saveAsDefault,
                                        });
                                        onClose();
                                    }
                                }}
                            >
                                Save
                            </button>

                            <button
                                style={{
                                    flex: 1,
                                    minWidth: 110,
                                    height: 36,
                                    borderRadius: 6,
                                    border: 'none',
                                    cursor: isDisabled
                                        ? 'not-allowed'
                                        : 'pointer',
                                    backgroundColor: isDisabled
                                        ? '#3a3a3a'
                                        : confirmHovered
                                          ? 'var(--accent1,#5294e2)'
                                          : 'var(--accent1,#4a8bd3)',
                                    color: isDisabled ? '#888' : '#fff',
                                    opacity: isDisabled ? 0.5 : 1,
                                    fontSize: 12,
                                    whiteSpace: 'nowrap',
                                }}
                                disabled={isDisabled}
                                onMouseEnter={() => setConfirmHovered(true)}
                                onMouseLeave={() => setConfirmHovered(false)}
                                onClick={() => {
                                    if (!isDisabled) handleConfirm();
                                }}
                            >
                                Save & Enable
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                }}
                onClick={onClose}
            />
        </>
    );
};
