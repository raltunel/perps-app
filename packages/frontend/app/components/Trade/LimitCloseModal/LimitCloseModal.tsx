import React, { useState, useEffect } from 'react';
import PriceInput from '../OrderInput/PriceInput/PriceInput';
import SizeInput from '../OrderInput/SizeInput/SizeInput';
import type { OrderBookMode } from '~/utils/orderbook/OrderBookIFs';
import styles from './LimitCloseModal.module.css';
import Modal from '~/components/Modal/Modal';
import PositionSize from '../OrderInput/PositionSIze/PositionSize';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import type { PositionIF } from '~/utils/UserDataIFs';
import useNumFormatter from '~/hooks/useNumFormatter';

interface PropsIF {
    close: () => void;
    position: PositionIF;
}

export default function LimitCloseModal({ close, position }: PropsIF) {
    const { formatNumWithOnlyDecimals } = useNumFormatter();

    const [price, setPrice] = useState(String(position.entryPx));
    const [selectedMode, setSelectedMode] = useState<OrderBookMode>('usd');
    const [isMidModeActive, setIsMidModeActive] = useState(false);

    const originalSize = Math.abs(position.szi);

    const [positionSize, setPositionSize] = useState(100);

    const [size, setSize] = useState(String(originalSize));

    useEffect(() => {
        const calculatedSize = (originalSize * positionSize) / 100;
        const formattedSize = formatNumWithOnlyDecimals(
            calculatedSize,
            8,
            true,
        );
        setSize(formattedSize);
    }, [positionSize, originalSize, formatNumWithOnlyDecimals]);

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
                        setMidPriceAsPriceInput={() => {
                            setPrice(String(position.entryPx));
                            setIsMidModeActive(true);
                        }}
                        isMidModeActive={isMidModeActive}
                        setIsMidModeActive={setIsMidModeActive}
                        isModal
                    />

                    <SizeInput
                        value={size}
                        onChange={(val) => {
                            if (typeof val === 'string') {
                                setSize(val);
                                const numVal = parseFloat(val);
                                if (!isNaN(numVal) && originalSize > 0) {
                                    const percentage = Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            (numVal / originalSize) * 100,
                                        ),
                                    );
                                    setPositionSize(Math.round(percentage));
                                }
                            }
                        }}
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
                            onChange={(val) => setPositionSize(val)}
                            hideValueDisplay
                        />
                    </div>

                    <SimpleButton
                        onClick={() => {
                            console.log('Confirm', {
                                price,
                                size,
                                originalSize,
                                positionSize,
                                selectedMode,
                            });
                        }}
                        bg='accent1'
                    >
                        Confirm
                    </SimpleButton>
                </div>
            </div>
        </Modal>
    );
}
