import React, { useEffect, useState } from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import { loadTradingViewLibrary } from '~/routes/chart/lazyLoading/useLazyTradingview';
import styles from './chartLoading.module.css';
import OrderLinesOverlayCanvas from '~/routes/chart/overlayCanvas/OrderLinesOverlayCanvas';
import LimitOrderPlacementCanvas from '~/routes/chart/overlayCanvas/LimitOrderPlacementCanvas';
import { useOrderPlacementStore } from '~/routes/chart/hooks/useOrderPlacement';
import { QuickModeConfirmModal } from '~/routes/chart/components/QuickModeConfirmModal';

const TradingViewWrapper: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tvLib, setTvLib] = useState<any>(null);
    const [chartLoadingStatus, setChartLoadingStatus] = useState<
        'loading' | 'error' | 'ready'
    >('loading');
    const { showQuickModeConfirm, closeQuickModeConfirm, confirmQuickMode } =
        useOrderPlacementStore();

    useEffect(() => {
        let mounted = true;
        (async () => {
            const lib = await loadTradingViewLibrary();
            if (!mounted) return;

            if (!lib) setChartLoadingStatus('error');
            else {
                setTvLib(lib);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    if (chartLoadingStatus === 'error')
        return (
            <div className='tv-error'>
                TradingView library is currently unavailable
            </div>
        );

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            {chartLoadingStatus === 'loading' && (
                <div className={`${styles.spinner_container}`}>
                    <div className={`${styles.spinner}`}></div>
                </div>
            )}

            {tvLib && (
                <TradingViewProvider
                    tradingviewLib={tvLib}
                    setChartLoadingStatus={setChartLoadingStatus}
                >
                    <TradingViewChart />
                    <OrderLinesOverlayCanvas />
                    <LimitOrderPlacementCanvas />
                </TradingViewProvider>
            )}

            {showQuickModeConfirm && (
                <QuickModeConfirmModal
                    onClose={closeQuickModeConfirm}
                    onConfirm={confirmQuickMode}
                />
            )}
        </div>
    );
};

export default TradingViewWrapper;
