import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import HistoryTwapTable from '~/components/Trade/TwapTable/HistoryTwapTable/HistoryTwapTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { TwapHistoryIF } from '~/utils/UserDataIFs';
import styles from './twapHistory.module.css';

function TwapHistory() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const [fetchedHistoryData, setFetchedHistoryData] = useState<
        TwapHistoryIF[]
    >([]);

    const { fetchTwapHistory } = useInfoApi();

    useEffect(() => {
        if (address) {
            fetchTwapHistory(address).then((data) => {
                setFetchedHistoryData(data);
                setIsFetched(true);
            });
        }
    }, [address]);

    const isFullScreen = true;

    // Memoize the container class name
    const containerClassName = useMemo(() => {
        return `${styles.container} ${isFullScreen ? styles.fullScreen : ''}`;
    }, [isFullScreen]);

    return (
        <div className={containerClassName}>
            <header>TWAP History</header>

            <div className={styles.content}>
                <HistoryTwapTable
                    data={fetchedHistoryData}
                    isFetched={isFetched}
                    pageMode={true}
                />
            </div>
        </div>
    );
}
export default TwapHistory;
