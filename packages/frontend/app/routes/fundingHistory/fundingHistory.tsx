import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import OrderHistoryTable from '~/components/Trade/OrderHistoryTable/OrderHistoryTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { OrderDataIF } from '~/utils/orderbook/OrderBookIFs';
import styles from './fundingHistory.module.css';
import type { UserFundingIF } from '~/utils/UserDataIFs';
import FundingHistoryTable from '~/components/Trade/FundingHistoryTable/FundingHistoryTable';

function FundingHistory() {
    const { address } = useParams<{ address: string }>();

    const [isFetched, setIsFetched] = useState(false);

    const [fetchedHistoryData, setFetchedHistoryData] = useState<
        UserFundingIF[]
    >([]);

    const { fetchFundingHistory } = useInfoApi();

    useEffect(() => {
        if (address) {
            fetchFundingHistory(address).then((data) => {
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
            <header>Funding History</header>

            <div className={styles.content}>
                <FundingHistoryTable
                    userFundings={fetchedHistoryData}
                    isFetched={isFetched}
                    pageMode={true}
                />
            </div>
        </div>
    );
}
export default FundingHistory;
