import { useEffect, useMemo, useState } from 'react';
import styles from './News.module.css';
import { useModal } from '~/hooks/useModal';
import Modal from '../Modal/Modal';
import { useKeydown } from '~/hooks/useKeydown';
import { useViewed } from '~/stores/AlreadySeenStore';

interface NewsItemIF {
    message: string;
    id: string;
}

export default function News() {
    console.log('cycling');

    const [news, setNews] = useState<NewsItemIF[]>([]);
    useEffect(() => {
        fetch('/news.json', { cache: 'no-store' })
            .then((res) => res.json())
            .then((formatted) => {
                setTimeout(() => {
                    setNews(formatted.news);
                }, 3000);
            });
    }, []);

    const OPEN_MODAL_DELAY_MS = 2000;
    const modalControl = useModal(OPEN_MODAL_DELAY_MS);

    useKeydown('/', modalControl.toggle, [modalControl.isOpen]);

    const alreadyViewed = useViewed();

    const unseen: {
        messages: string[];
        hashes: string[];
    } = useMemo(() => {
        const messages: string[] = [];
        const hashes: string[] = [];
        news.forEach((n: NewsItemIF) => {
            if (!alreadyViewed.checkIfViewed(n.id)) {
                messages.push(n.message);
                hashes.push(n.id);
            }
        });
        return {
            messages,
            hashes,
        };
    }, [news, alreadyViewed]);

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
