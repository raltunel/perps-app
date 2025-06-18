import styles from './TransferModal.module.css';
import Modal from '../Modal/Modal';
import TransferDropdown from './TransferDropdown';
import { useState } from 'react';

interface propsIF {
    closeModal: () => void;
}

export default function TransferModal(props: propsIF) {
    const { closeModal } = props;

    const [fromAccount, setFromAccount] = useState<string>('Master Account');
    const [toAccount, setToAccount] = useState<string>('Master Account');
    const [asset, setAsset] = useState<string>('USDe');

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
            </div>
        </Modal>
    );
}
