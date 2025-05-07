import ShareModal from '~/components/ShareModal/ShareModal';
import styles from './testpage.module.css';
import { type useModalIF, useModal } from '~/hooks/useModal';

export default function testpage() {

    const modalCtrl: useModalIF = useModal('open');

    return (
        <div className={styles.testpage}>
            <button onClick={modalCtrl.open}>Open Modal</button>
            { modalCtrl.isOpen && <ShareModal close={modalCtrl.close} /> }
        </div>
    );
}
