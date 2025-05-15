import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import FillTwapTable from '~/components/Trade/TwapTable/FillTwapTable/FillTwapTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { TwapSliceFillIF } from '~/utils/UserDataIFs';
import styles from './twapFillHistory.module.css';

function TwapFillHistory() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const [fetchedHistoryData, setFetchedHistoryData] = useState<
        TwapSliceFillIF[]
    >([]);

    const { fetchTwapSliceFills } = useInfoApi();

    useEffect(() => {
        if (address) {
            fetchTwapSliceFills(address).then((data) => {
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
            <header>TWAP Fill History</header>

            <div className={styles.content}>
                <FillTwapTable
                    data={fetchedHistoryData}
                    isFetched={isFetched}
                    pageMode={true}
                />
            </div>
        </div>
    );
}
export default TwapFillHistory;
