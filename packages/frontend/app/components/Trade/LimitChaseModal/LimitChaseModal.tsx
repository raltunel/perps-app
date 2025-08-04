import React, { useState } from 'react';
import PriceInput from '../OrderInput/PriceInput/PriceInput';
import SizeInput from '../OrderInput/SizeInput/SizeInput';
import type { OrderBookMode } from '~/utils/orderbook/OrderBookIFs';
import styles from './LimitChaseModal.module.css';
import Modal from '~/components/Modal/Modal';
import PositionSize from '../OrderInput/PositionSIze/PositionSize';
import SimpleButton from '~/components/SimpleButton/SimpleButton';

interface PropsIF {
    close: () => void;
}

export default function LimitChaseModal({ close }: PropsIF) {
    const [price, setPrice] = useState('123.45');
    const [size, setSize] = useState('10');
    const [selectedMode, setSelectedMode] = useState<OrderBookMode>('usd');
    const [isMidModeActive, setIsMidModeActive] = useState(false);
    const [positionSize, setPositionSize] = useState(50); // %

    return (
        <Modal title='Limit Chase' close={close}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <PriceInput
                        value={price}
                        onChange={(val) => {
                            if (typeof val === 'string') setPrice(val);
                        }}
                        onBlur={(e) => console.log('Price blur', e)}
                        onKeyDown={(e) => console.log('Price keydown', e.key)}
                        className=''
                        ariaLabel='price-input'
                        showMidButton={true}
                        setMidPriceAsPriceInput={() => {
                            console.log('Set mid price');
                            setPrice('MidPriceMock');
                        }}
                        isMidModeActive={isMidModeActive}
                        setIsMidModeActive={setIsMidModeActive}
                    />

                    <SizeInput
                        value={size}
                        onChange={(val) => {
                            if (typeof val === 'string') setSize(val);
                        }}
                        onBlur={(e) => console.log('Size blur', e)}
                        onKeyDown={(e) => console.log('Size keydown', e.key)}
                        onFocus={() => console.log('Size input focused')}
                        className=''
                        ariaLabel='size-input'
                        useTotalSize={false}
                        symbol='ETH'
                        selectedMode={selectedMode}
                        setSelectedMode={setSelectedMode}
                    />

                    <PositionSize
                        value={positionSize}
                        onChange={(val) => {
                            console.log('Position size changed to', val);
                            setPositionSize(val);
                        }}
                        className=''
                    />
                    <SimpleButton
                        onClick={() => console.log('Confirm')}
                        bg='accent1'
                    >
                        Confirm
                    </SimpleButton>
                </div>
            </div>
        </Modal>
    );
}
