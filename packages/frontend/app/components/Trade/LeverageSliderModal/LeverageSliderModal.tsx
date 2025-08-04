import { useEffect, useState } from 'react';
// import { LuCircleHelp } from 'react-icons/lu';
import Modal from '~/components/Modal/Modal';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
// import Tooltip from '~/components/Tooltip/Tooltip';
import { useLeverageStore } from '~/stores/LeverageStore';
import LeverageSlider from '../OrderInput/LeverageSlider/LeverageSlider';
import styles from './LeverageSliderModal.module.css';

interface LeverageSliderModalProps {
    currentLeverage: number;
    onClose: () => void;
    maxLeverage?: number;
    onConfirm?: (newLeverage: number) => void;
}

export default function LeverageSliderModal({
    currentLeverage,
    maxLeverage,
    onClose,
    onConfirm,
}: LeverageSliderModalProps) {
    const [value, setValue] = useState<number>(currentLeverage);
    const setPreferredLeverage = useLeverageStore(
        (state) => state.setPreferredLeverage,
    );
    // const currentMarket = useLeverageStore((state) => state.currentMarket);

    // Update local state if currentLeverage prop changes
    useEffect(() => {
        setValue(currentLeverage);
    }, [currentLeverage]);

    const handleSliderChange = (newValue: number) => {
        // Update the leverage in the store immediately as the slider changes
        setValue(newValue);
    };

    const handleSliderClick = (newLeverage: number) => {
        setValue(newLeverage);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            setPreferredLeverage(value);
            onConfirm(value);
        }
        onClose();
    };

    return (
        <Modal title='Adjust Leverage' close={onClose}>
            <div className={styles.leverageSliderContainer}>
                {/* Use the enhanced LeverageSlider component in modal mode */}
                <div className={styles.sliderSection}>
                    <LeverageSlider
                        value={value}
                        onChange={handleSliderChange}
                        onClick={handleSliderClick}
                        modalMode={true}
                        maxLeverage={maxLeverage}
                        hideTitle={true}
                        className={styles.modalSlider}
                    />
                </div>

                {/* <div className={styles.maxPositionContainer}>
                    <p>
                        Max position at Current Leverage
                        <Tooltip
                            content='max position at current level'
                            position='right'
                        >
                            <LuCircleHelp size={12} />
                        </Tooltip>
                    </p>
                    <span>100,000 USD</span>
                </div> */}

                {/* Action buttons */}
                <div className={styles.buttonContainer}>
                    <SimpleButton onClick={onClose} bg='dark4'>
                        Cancel
                    </SimpleButton>
                    <SimpleButton onClick={handleConfirm} bg='accent1'>
                        Confirm
                    </SimpleButton>
                </div>
            </div>
        </Modal>
    );
}
