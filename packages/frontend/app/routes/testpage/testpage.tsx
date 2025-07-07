import Modal from '~/components/Modal/Modal';
import { useModal } from '~/hooks/useModal';
import styles from './testpage.module.css';

const modals = {
    dogs: {
        title: 'Dogs!',
        content: 'Dogs rule',
    },
    cats: {
        title: 'Cats!',
        content: 'Cats suck',
    },
    geckos: {
        title: 'Geckos!',
        content: 'Geckos are alright',
    },
};

export default function testpage() {
    const modalCtrl = useModal<keyof typeof modals>();

    return (
        <div className={styles.testpage}>
            <button onClick={() => modalCtrl.open('dogs')}>
                Click for Dogs
            </button>
            <button onClick={() => modalCtrl.open('cats')}>
                Click for Cats
            </button>
            <button onClick={() => modalCtrl.open('geckos')}>
                Click for Geckos
            </button>
            {modalCtrl.isOpen && (
                <Modal
                    title={modals[modalCtrl.content].title}
                    close={modalCtrl.close}
                >
                    {modals[modalCtrl.content].content}
                </Modal>
            )}
        </div>
    );
}
