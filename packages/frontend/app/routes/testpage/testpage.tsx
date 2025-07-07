import Modal from '~/components/Modal/Modal';
import { useModal } from '~/hooks/useModal';
import styles from './testpage.module.css';

export default function testpage() {
    const modalCtrl = useModal<'up' | 'down'>();

    return (
        <div className={styles.testpage}>
            <button onClick={() => modalCtrl.open('up')}>Up</button>
            <button onClick={() => modalCtrl.open('down')}>Down</button>
            {modalCtrl.isOpen && (
                <Modal title='My Modal' close={modalCtrl.close}>
                    {modalCtrl.content === 'up' && <h2>Up!</h2>}
                    {modalCtrl.content === 'down' && <h2>Down!</h2>}
                </Modal>
            )}
        </div>
    );
}
