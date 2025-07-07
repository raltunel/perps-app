import Modal from '~/components/Modal/Modal';
import { useModal } from '~/hooks/useModal';
import styles from './testpage.module.css';

export default function testpage() {
    const modalCtrl = useModal();

    return (
        <div className={styles.testpage}>
            <button onClick={() => modalCtrl.open()}>Click for Dogs</button>
            <button onClick={() => modalCtrl.open()}>Click for Cats</button>
            <button onClick={() => modalCtrl.open()}>Click for Geckos</button>
            {modalCtrl.isOpen && (
                <Modal title='Dogs' close={modalCtrl.close}>
                    <p>Dogs rule</p>
                </Modal>
            )}
        </div>
    );
}
