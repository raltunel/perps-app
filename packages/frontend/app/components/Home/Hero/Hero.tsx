// import useFetchAmbientStats from '../../../App/hooks/useFetchAmbientStats';
// import { FlexContainer } from '../../../styled/Common';
// import TopPools from '../TopPools/TopPools';
// import AnimatedGradientPaths from './AnimatedGradientPaths';
import SimpleButton from '~/components/SimpleButton/SimpleButton';
import styles from './Hero.module.css';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { Link, useNavigation } from 'react-router';
// import TradeNowButton from './TradeNowButton/TradeNowButton';
export default function Hero() {
    // const { totalTvlString, totalVolumeString, totalFeesString } =
    //     useFetchAmbientStats();
    const navigation = useNavigation();

    const { symbol } = useTradeDataStore();

    function TradeButton({ symbol }: { symbol: string }) {
        const isNavigating = navigation.state !== 'idle';

        return (
            <Link
                to={`/v2/trade/${symbol}`}
                className={styles.tradeButton}
                viewTransition
            >
                {isNavigating ? 'Loading...' : 'Start Trading'}
            </Link>
        );
    }

    return (
        <div className={styles.hero_container}>
            <div className={styles.hero_heading}>
                <h2>
                    Zero-to-<span>One</span>{' '}
                </h2>
                <h2>Decentralized Trading Protocol</h2>
            </div>

            <p>
                Ambient is an entirely new kind of decentralized exchange
                combining unique DeFi native products with a user experience
                rivaling CEXes
            </p>

            <TradeButton symbol={symbol} />
        </div>
    );
}
