import { useState } from 'react';
import styles from './MarginModal.module.css';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import { type marginModesT } from '~/stores/TradeDataStore';

interface PropsIF {
    initial: marginModesT;
    handleConfirm: (m: marginModesT) => void;
}
export default function MarginModal(props: PropsIF) {
    const { initial, handleConfirm } = props;

    // hook to track the current selection before updating settings
    const [selected, setSelected] = useState<marginModesT>(initial);

    return (
        <section className={styles.margin_modal_content}>
            <div className={styles.margin_modal_buttons}>
                <button
                    className={styles[selected === 'cross' ? 'selected' : '']}
                    onClick={() => setSelected('cross')}
                >
                    <h3>Cross Margin</h3>
                    <p>
                        All cross positions share the same cross margin as
                        collateral. In the event of liquidation, your cross
                        margin balance and any remaining open positions under
                        assets in this mode may be forfeited.
                    </p>
                </button>
                <button
                    className={
                        styles[selected === 'isolated' ? 'selected' : '']
                    }
                    onClick={() => setSelected('isolated')}
                >
                    <h3>Isolated Mode</h3>
                    <p>
                        Manage your risk on individual positions by restricting
                        the amount of margin allocated to each. If the margin
                        ratio of an isolated position reaches 100%, the position
                        will be liquidated. Margin can be added or removed to
                        individual positions in this mode.
                    </p>
                </button>
            </div>
            <SimpleButton
                bg='accent1'
                onClick={() => handleConfirm(selected)}
                style={{ height: '47px' }}
            >
                Confirm
            </SimpleButton>
        </section>
    );
}
