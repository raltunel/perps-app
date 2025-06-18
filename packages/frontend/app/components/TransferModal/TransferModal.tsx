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
            </div>
        </Modal>
    );
}
