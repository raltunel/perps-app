import styles from './TransferModal.module.css';
import Modal from '../Modal/Modal';

interface propsIF {
    closeModal: () => void;
}

export default function TransferModal(props: propsIF) {
    const { closeModal } = props;
    return (
        <Modal title='Transfer' close={closeModal}>
            <div className={styles.green}>hi there</div>
        </Modal>
    );
}
