import { useState } from 'react';
import { FiDollarSign, FiPercent } from 'react-icons/fi';
import { TbHeartFilled } from 'react-icons/tb';
import { HorizontalScrollable } from '~/components/Wrappers/HorizontanScrollable/HorizontalScrollable';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import styles from './watchlist.module.css';
import WatchListNode from './watchlistnode/watchlistnode';

const WatchList: React.FC = () => {
    const { favCoins } = useTradeDataStore();

    const [watchListMode, setWatchListMode] = useState<'dollar' | 'percent'>(
        'dollar',
    );

    return (
        <div className={styles.watchListContainer}>
            <TbHeartFilled className={styles.favIcon} size={23} />
            <FiDollarSign
                onClick={() => setWatchListMode('dollar')}
                className={`${styles.watchListToolbarIcon} ${watchListMode === 'dollar' ? styles.active : ''}`}
            />
            <FiPercent
                onClick={() => setWatchListMode('percent')}
                className={`${styles.watchListToolbarIcon} ${styles.percentIcon}  ${watchListMode === 'percent' ? styles.active : ''}`}
            />

            <HorizontalScrollable className={styles.watchListLimitor}>
                <div className={styles.watchListNodesWrapper}>
                    {favCoins &&
                        favCoins.map((e) => (
                            <WatchListNode
                                key={e.coin}
                                coin={e.coin}
                                markPx={e.markPx}
                                prevDayPx={e.prevDayPx}
                                isActive={e.coin === favCoins[0].coin}
                                showMode={watchListMode}
                            />
                        ))}
                </div>
            </HorizontalScrollable>
        </div>
    );
};

export default WatchList;
