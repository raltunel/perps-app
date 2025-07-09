import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ExternalPage from '~/components/ExternalPage/ExternalPage';
import FillTwapTable from '~/components/Trade/TwapTable/FillTwapTable/FillTwapTable';
import { useInfoApi } from '~/hooks/useInfoApi';
import type { TwapSliceFillIF } from '~/utils/UserDataIFs';

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

    return (
        <ExternalPage title='TWAP Fill History'>
            <FillTwapTable
                data={fetchedHistoryData}
                isFetched={isFetched}
                pageMode={true}
            />
        </ExternalPage>
    );
}
export default TwapFillHistory;
