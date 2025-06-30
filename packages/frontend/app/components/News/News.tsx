import styles from './News.module.css';
import { useModal } from '~/hooks/useModal';
import Modal from '../Modal/Modal';
import { useKeydown } from '~/hooks/useKeydown';

interface NewsItemIF {
    message: string;
    id: string;
}

const mockNews: NewsItemIF[] = [
    {
        message: 'First',
        id: 'aaa',
    },
    {
        message: 'Second',
        id: 'bbb',
    },
    // {
    //     message: 'Third',
    //     id: 'ccc'
    // },
    {
        message: 'Fourth',
        id: 'mmm',
    },
];

export default function News() {
    const modalControl = useModal(2000);

    useKeydown('/', modalControl.toggle, [modalControl.isOpen]);

    return (
        <>
            {modalControl.isOpen && (
                <Modal
                    title='News'
                    close={() => {
                        modalControl.close();
                    }}
                >
                    <ul className={styles.news}>
                        {mockNews.map((n: NewsItemIF) => (
                            <li>{n.message}</li>
                        ))}
                    </ul>
                </Modal>
            )}
        </>
    );
}
