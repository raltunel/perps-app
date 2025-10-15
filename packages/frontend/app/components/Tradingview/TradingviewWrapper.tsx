import React, { useEffect, useState } from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import { loadTradingViewLibrary } from '~/routes/chart/lazyLoading/useLazyTradingview';
import OverlayCanvas from '~/routes/chart/overlayCanvas/overlayCanvas';

const TradingViewWrapper: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tvLib, setTvLib] = useState<any>(null);
    const [status, setStatus] = useState<'loading' | 'error' | 'ready'>(
        'loading',
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            const lib = await loadTradingViewLibrary();
            if (!mounted) return;

            if (!lib) setStatus('error');
            else {
                setTvLib(lib);
                setStatus('ready');
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    if (status === 'loading')
        return <div className='tv-loading'>Loading chart...</div>;
    if (status === 'error')
        return (
            <div className='tv-error'>
                TradingView library is currently unavailable
            </div>
        );

    return (
        <TradingViewProvider tradingviewLib={tvLib}>
            <TradingViewChart />
            <OverlayCanvas />
        </TradingViewProvider>
    );
};

export default TradingViewWrapper;
