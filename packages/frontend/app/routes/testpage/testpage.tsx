import Modal from '~/components/Modal/Modal';
import { useModal } from '~/hooks/useModal';
import styles from './testpage.module.css';

export default function testpage() {
    const modalCtrl = useModal<1 | 2 | 3>();

    return (
        <div className={styles.testpage}>
            <button onClick={() => modalCtrl.open(1)}>Click for Dogs</button>
            <button onClick={() => modalCtrl.open(2)}>Click for Cats</button>
            <button onClick={() => modalCtrl.open(3)}>Click for Geckos</button>
            {modalCtrl.isOpen && (
                <Modal title='Dogs' close={modalCtrl.close}>
                    {modalCtrl.content === 1 && (
                        <div>This is the conent for Modal 1</div>
                    )}
                    {modalCtrl.content === 2 && (
                        <div>This is the conent for Modal 2</div>
                    )}
                    {modalCtrl.content === 3 && (
                        <div>This is the conent for Modal 3</div>
                    )}
                </Modal>
            )}
        </div>
    );
}
