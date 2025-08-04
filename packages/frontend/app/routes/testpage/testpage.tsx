import { useModal } from '~/hooks/useModal';
import styles from './testpage.module.css';
import LimitChaseModal from '~/components/Trade/LimitChaseModal/LimitChaseModal';

export default function testpage() {
    const modalCtrl = useModal('closed');

    return (
        <div className={styles.testpage}>
            <button onClick={modalCtrl.open}>Open Limit Chase Modal</button>

            {modalCtrl.isOpen && <LimitChaseModal close={modalCtrl.close} />}
        </div>
    );
}
