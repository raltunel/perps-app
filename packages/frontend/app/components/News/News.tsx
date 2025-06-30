import { useEffect, useMemo, useState } from 'react';
import styles from './News.module.css';
import { useModal } from '~/hooks/useModal';
import Modal from '../Modal/Modal';
import { useViewed } from '~/stores/AlreadySeenStore';

interface NewsItemIF {
    message: string;
    id: string;
}

export default function News() {
    // logic to fetch news data asynchronously
    const [news, setNews] = useState<NewsItemIF[]>([]);
    useEffect(() => {
        fetch('/news.json', { cache: 'no-store' })
            .then((res) => res.json())
            .then((formatted) => {
                setNews(formatted.news);
            });
    }, []);

    // logic to handle modal opening and closing
    const OPEN_MODAL_DELAY_MS = 2000;
    const modalControl = useModal(OPEN_MODAL_DELAY_MS);

    // logic to prevent a user from seeing a news item repeatedly
    const alreadyViewed = useViewed();

    // apply filter to messages received by the app
    const unseen: {
        messages: string[];
        hashes: string[];
    } = useMemo(() => {
        // output variable for human-readable messages
        const messages: string[] = [];
        // output variable for message hashes
        const hashes: string[] = [];
        // iterate over news items, handle ones not previously seen
        news.forEach((n: NewsItemIF) => {
            if (!alreadyViewed.checkIfViewed(n.id)) {
                messages.push(n.message);
                hashes.push(n.id);
            }
        });
        // return output variables
        return {
            messages,
            hashes,
        };
    }, [
        // recalculate for changes in the base data set
        news,
        // recalculate for changes in the list of viewed messages
        alreadyViewed,
    ]);

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
