import styles from './TransferModal.module.css';
import Modal from '../Modal/Modal';
import TransferDropdown from './TransferDropdown';
import { useState } from 'react';
import SimpleButton from '../SimpleButton/SimpleButton';

interface propsIF {
    closeModal: () => void;
}

export default function TransferModal(props: propsIF) {
    const { closeModal } = props;

    const [fromAccount, setFromAccount] = useState<string>('Master Account');
    const [toAccount, setToAccount] = useState<string>('Master Account');
    const [asset, setAsset] = useState<string>('USDe');
    const [qty, setQty] = useState<string>('');

    return (
        <Modal title='Transfer' close={closeModal}>
            <div className={styles.transfer_modal}>
                <TransferDropdown
                    idForDOM='transfer_dropdown_field_from'
                    labelText='From'
                    initial={fromAccount}
                    options={[
                        'Master Account',
                        'Sub-Account 1',
                        'Sub-Account 2',
                    ]}
                    handleChange={setFromAccount}
                />
                <TransferDropdown
                    idForDOM='transfer_dropdown_field_to'
                    labelText='To'
                    initial={toAccount}
                    options={[
                        'Master Account',
                        'Sub-Account 1',
                        'Sub-Account 2',
                    ]}
                    handleChange={setToAccount}
                />
                <TransferDropdown
                    idForDOM='transfer_dropdown_field_asset'
                    labelText='Asset'
                    initial={asset}
                    options={['USDe', 'BTC']}
                    handleChange={setAsset}
                />
                <div className={styles.asset_qty_input_wrapper}>
                    <input
                        id='transfer_asset_qty_input'
                        type='text'
                        placeholder='Amount'
                        value={qty}
                        onChange={(e) => setQty(e.currentTarget.value)}
                    />
                    <div onClick={() => setQty('1000')}>Max</div>
                </div>
                <div className={styles.info}>
                    <div>
                        <p>Available to Deposit</p>
                        <p>1,000.00</p>
                    </div>
                    <div>
                        <p>Network Fee</p>
                        <p>$0.001</p>
                    </div>
                </div>
                <SimpleButton
                    onClick={() => {
                        console.log('Asset transferred!');
                        closeModal();
                    }}
                >
                    Confirm
                </SimpleButton>
            </div>
        </Modal>
    );
}
