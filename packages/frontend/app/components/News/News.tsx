import { useMemo } from 'react';
import styles from './News.module.css';
import { useModal } from '~/hooks/useModal';
import Modal from '../Modal/Modal';
import { useKeydown } from '~/hooks/useKeydown';
import { useViewed } from '~/stores/AlreadySeenStore';

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
    {
        message: 'Third',
        id: 'ccc',
    },
    {
        message: 'Fourth',
        id: 'mmm',
    },
];

export default function News() {
    console.log('cycling');

    const modalControl = useModal(2000);

    useKeydown('/', modalControl.toggle, [modalControl.isOpen]);

    const alreadyViewed = useViewed();

    const unseen = useMemo(() => {
        const messages: string[] = [];
        const hashes: string[] = [];
        mockNews.forEach((n: NewsItemIF) => {
            if (!alreadyViewed.checkIfViewed(n.id)) {
                messages.push(n.message);
                hashes.push(n.id);
            }
        });
        return {
            messages,
            hashes,
        };
    }, [mockNews, alreadyViewed]);

    return (
        <>
            {modalControl.isOpen && unseen.messages.length > 0 && (
                <Modal
                    title='News'
                    close={() => {
                        modalControl.close();
                        alreadyViewed.markAsViewed(unseen.hashes);
                    }}
                >
                    <ul className={styles.news}>
                        {unseen.messages.map((n: string) => (
                            <li>{n}</li>
                        ))}
                    </ul>
                </Modal>
            )}
        </>
    );
}
