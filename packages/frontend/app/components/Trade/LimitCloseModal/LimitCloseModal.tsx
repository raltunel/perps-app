import React, { useEffect, useRef, useState } from 'react';
import Modal from '~/components/Modal/Modal';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { useLimitOrderService } from '~/hooks/useLimitOrderService';
import useNumFormatter from '~/hooks/useNumFormatter';
import { type useAppOptionsIF, useAppOptions } from '~/stores/AppOptionsStore';
import {
    type NotificationStoreIF,
    useNotificationStore,
} from '~/stores/NotificationStore';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { blockExplorer } from '~/utils/Constants';
import type { OrderBookMode } from '~/utils/orderbook/OrderBookIFs';
import type { PositionIF } from '~/utils/UserDataIFs';
import PositionSize from '../OrderInput/PositionSIze/PositionSize';
import PriceInput from '../OrderInput/PriceInput/PriceInput';
import SizeInput from '../OrderInput/SizeInput/SizeInput';
import styles from './LimitCloseModal.module.css';

interface PropsIF {
    close: () => void;
    position: PositionIF;
}

export default function LimitCloseModal({ close, position }: PropsIF) {
    const { formatNumWithOnlyDecimals } = useNumFormatter();

    const { symbolInfo } = useTradeDataStore();

    const activeOptions: useAppOptionsIF = useAppOptions();

    const { executeLimitOrder } = useLimitOrderService();

    const [isProcessingOrder, setIsProcessingOrder] = useState(false);

    const { parseFormattedNum, formatNum, parseFormattedWithOnlyDecimals } =
        useNumFormatter();

    const isPositionLong = position.szi > 0;

    const { buys, sells } = useOrderBookStore();

    const markPx = symbolInfo?.markPx;

    const getMidPrice = () => {
        if (!buys.length || !sells.length) return null;
        const midPrice = (buys[0].px + sells[0].px) / 2;
        return midPrice;
    };

    const [price, setPrice] = useState(String(getMidPrice()));
    const [selectedMode, setSelectedMode] = useState<OrderBookMode>('symbol');
    const [isMidModeActive, setIsMidModeActive] = useState(false);

    const originalSize = Math.abs(position.szi);

    const [positionSize, setPositionSize] = useState(100);
    const [size, setSize] = useState(String(originalSize));
    const [isOverLimit, setIsOverLimit] = useState(false);

    const sizeNum = parseFormattedWithOnlyDecimals(size);
    // the useeffect was updating and reformatting user input so I added this to track it to differentiate between the input and the slider
    const lastChangedBySlider = useRef(true);

    useEffect(() => {
        if (isMidModeActive) {
            setMidPriceAsPriceInput();
        }
    }, [
        isMidModeActive,
        !buys.length,
        !sells.length,
        buys?.[0]?.px,
        sells?.[0]?.px,
        markPx,
    ]);

    useEffect(() => {
        if (!lastChangedBySlider.current) return;

        const calculatedSize = (originalSize * positionSize) / 100;
        const formattedSize = formatNumWithOnlyDecimals(
            calculatedSize,
            8,
            true,
        );
        setSize(formattedSize);

        if (Math.abs(calculatedSize) < 1e-8) {
            setIsOverLimit(true);
        } else if (positionSize > 0) {
            const numVal = parseFloat(formattedSize);
            if (numVal <= originalSize && numVal > 0) {
                setIsOverLimit(false);
            }
        }
    }, [positionSize, originalSize, formatNumWithOnlyDecimals]);

    const handleSizeChange = (
        val: string | React.ChangeEvent<HTMLInputElement>,
    ) => {
        let inputValue: string;

        if (typeof val === 'string') {
            inputValue = val;
        } else if (val?.target?.value !== undefined) {
            inputValue = val.target.value;
        } else return;
        lastChangedBySlider.current = false;
        setSize(inputValue);

        const numVal = parseFloat(inputValue);
        if (!isNaN(numVal) && originalSize > 0) {
            const percentage = (numVal / originalSize) * 100;

            if (numVal > originalSize) {
                setPositionSize(100);
                setIsOverLimit(true);
            } else if (Math.abs(numVal) < 1e-8) {
                setPositionSize(0);
                setIsOverLimit(true);
            } else {
                setPositionSize(Math.round(Math.max(0, percentage)));
                setIsOverLimit(false);
            }
        } else {
            setIsOverLimit(true);
        }
    };

    function roundDownToTenth(value: number) {
        return Math.floor(value * 10) / 10;
    }

    const handlePositionSizeChange = (val: number) => {
        // for input
        lastChangedBySlider.current = true;
        setPositionSize(val);
        setIsOverLimit(val === 0);
    };

    const getWarningMessage = () => {
        const numVal = parseFloat(size);
        if (isNaN(numVal) || numVal < 0) return 'Please enter a valid size';
        if (Math.abs(numVal) < 1e-8) return 'Size cannot be zero';
        if (numVal > originalSize)
            return 'Size cannot exceed your position size';
        return '';
    };

    const setMidPriceAsPriceInput = () => {
        if (buys.length > 0 && sells.length > 0) {
            const resolution = buys[0].px - buys[1].px;
            const midOrMarkPrice = resolution <= 1 ? getMidPrice() : markPx;
            if (!midOrMarkPrice) return;
            const formattedMidPrice = formatNumWithOnlyDecimals(
                midOrMarkPrice,
                6,
                true,
            );
            setPrice(formattedMidPrice);
            setIsMidModeActive(true);
        }
    };
    const notifications: NotificationStoreIF = useNotificationStore();

    // fn to submit a 'Buy' limit order
    async function submitLimitBuy(): Promise<void> {
        // Validate position size
        if (!sizeNum || sizeNum <= 0) {
            notifications.add({
                title: 'Invalid Order Size',
                message: 'Please enter a valid order size',
                icon: 'error',
            });
            close();
            return;
        }

        // Validate price
        const limitPrice = parseFormattedNum(price);
        if (!limitPrice || limitPrice <= 0) {
            notifications.add({
                title: 'Invalid Price',
                message: 'Please enter a valid limit price',
                icon: 'error',
            });
            close();
            return;
        }

        setIsProcessingOrder(true);

        if (activeOptions.skipOpenOrderConfirm) {
            close();
            // Show pending notification
            notifications.add({
                title: 'Buy / Long Limit Order Pending',
                message: `Buying ${formatNum(sizeNum)} ${symbolInfo?.coin} at ${formatNum(limitPrice)}`,
                icon: 'spinner',
            });
        }

        try {
            // Execute limit order
            const result = await executeLimitOrder({
                quantity: sizeNum,
                price: roundDownToTenth(limitPrice),
                side: 'buy',
            });

            if (result.success) {
                notifications.add({
                    title: 'Limit Order Placed',
                    message: `Successfully placed buy order for ${formatNum(sizeNum)} ${symbolInfo?.coin} at ${formatNum(limitPrice)}`,
                    icon: 'check',
                    txLink: `${blockExplorer}/tx/${result.signature}`,
                    removeAfter: 10000,
                });
            } else {
                notifications.add({
                    title: 'Limit Order Failed',
                    message: result.error || 'Failed to place limit order',
                    icon: 'error',
                    removeAfter: 15000,
                    txLink: result.signature
                        ? `${blockExplorer}/tx/${result.signature}`
                        : undefined,
                });
            }
        } catch (error) {
            console.error('❌ Error submitting limit buy order:', error);
            notifications.add({
                title: 'Limit Order Failed',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
                icon: 'error',
                removeAfter: 15000,
            });
        } finally {
            setIsProcessingOrder(false);
            close();
        }
    }

    // fn to submit a 'Sell' limit order
    async function submitLimitSell(): Promise<void> {
        // Validate position size
        if (!sizeNum || sizeNum <= 0) {
            notifications.add({
                title: 'Invalid Order Size',
                message: 'Please enter a valid order size',
                icon: 'error',
            });
            close();
            return;
        }

        // Validate price
        const limitPrice = parseFormattedNum(price);
        if (!limitPrice || limitPrice <= 0) {
            notifications.add({
                title: 'Invalid Price',
                message: 'Please enter a valid limit price',
                icon: 'error',
            });
            close();
            return;
        }

        setIsProcessingOrder(true);

        if (activeOptions.skipOpenOrderConfirm) {
            close();
            // Show pending notification
            notifications.add({
                title: 'Sell / Short Limit Order Pending',
                message: `Selling ${formatNum(sizeNum)} ${symbolInfo?.coin} at ${formatNum(limitPrice)}`,
                icon: 'spinner',
            });
        }

        try {
            // Execute limit order
            const result = await executeLimitOrder({
                quantity: sizeNum,
                price: roundDownToTenth(limitPrice),
                side: 'sell',
            });

            if (result.success) {
                notifications.add({
                    title: 'Limit Order Placed',
                    message: `Successfully placed sell order for ${formatNum(sizeNum)} ${symbolInfo?.coin} at ${formatNum(limitPrice)}`,
                    icon: 'check',
                    txLink: `${blockExplorer}/tx/${result.signature}`,
                    removeAfter: 10000,
                });
            } else {
                notifications.add({
                    title: 'Limit Order Failed',
                    message: result.error || 'Failed to place limit order',
                    icon: 'error',
                    removeAfter: 15000,
                    txLink: result.signature
                        ? `${blockExplorer}/tx/${result.signature}`
                        : undefined,
                });
            }
        } catch (error) {
            console.error('❌ Error submitting limit sell order:', error);
            notifications.add({
                title: 'Limit Order Failed',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred',
                icon: 'error',
                removeAfter: 15000,
            });
        } finally {
            setIsProcessingOrder(false);
            close();
        }
    }

    return (
        <Modal title='Limit Close' close={close}>
            <div className={styles.container}>
                <p className={styles.description}>
                    This will send an order to close your position at the limit
                    price.
                </p>
                <div className={styles.content}>
                    <PriceInput
                        value={price}
                        onChange={(val) => {
                            setIsMidModeActive(false);
                            if (typeof val === 'string') {
                                setPrice(val);
                            } else if (val?.target?.value !== undefined) {
                                setPrice(val.target.value);
                            }
                        }}
                        onBlur={(e) => console.log('Price blur', e)}
                        onKeyDown={(e) => console.log('Price keydown', e.key)}
                        className=''
                        ariaLabel='price-input'
                        showMidButton={true}
                        setMidPriceAsPriceInput={setMidPriceAsPriceInput}
                        isMidModeActive={isMidModeActive}
                        setIsMidModeActive={setIsMidModeActive}
                        isModal
                    />

                    <SizeInput
                        value={size}
                        onChange={handleSizeChange}
                        onBlur={(e) => console.log('Size blur', e)}
                        onKeyDown={(e) => console.log('Size keydown', e.key)}
                        onFocus={() => console.log('Size input focused')}
                        className=''
                        ariaLabel='size-input'
                        useTotalSize={false}
                        symbol={position.coin}
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                        isModal
                    />
                    <div className={styles.position_size_container}>
                        <PositionSize
                            value={positionSize}
                            onChange={handlePositionSizeChange}
                            isModal
                        />
                        {isOverLimit && (
                            <div className={styles.warning_message}>
                                {getWarningMessage()}
                            </div>
                        )}
                    </div>

                    <p className={styles.estimatedPnl}>
                        Estimated closed PNL (without fees): <span>$0.17</span>
                    </p>
                    <SimpleButton
                        onClick={() => {
                            console.log('confirm');
                            if (isPositionLong) {
                                submitLimitSell();
                            } else {
                                submitLimitBuy();
                            }
                        }}
                        bg='accent1'
                        disabled={isProcessingOrder || isOverLimit}
                    >
                        {isProcessingOrder ? 'Processing...' : 'Confirm'}
                    </SimpleButton>
                </div>
            </div>
        </Modal>
    );
}
