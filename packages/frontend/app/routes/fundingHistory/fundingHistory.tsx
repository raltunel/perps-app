import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import FundingHistoryTable from '~/components/Trade/FundingHistoryTable/FundingHistoryTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { UserFundingIF } from '~/utils/UserDataIFs';

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

    return (
        <ExternalPage title='Funding History'>
            <FundingHistoryTable
                userFundings={fetchedHistoryData}
                isFetched={isFetched}
                pageMode={true}
            />
        </ExternalPage>
    );
}
export default FundingHistory;
