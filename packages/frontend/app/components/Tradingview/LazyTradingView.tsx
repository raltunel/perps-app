import React, { useEffect, useState } from 'react';
import ChartLoading from '~/components/ChartLoading/ChartLoading';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import OverlayCanvas from '~/routes/chart/overlayCanvas/overlayCanvas';

export const LazyTradingView: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    const [isChartReadyForFirstOpen, setIsChartReadyForFirstOpen] =
        useState(false);

    useEffect(() => {
        // Only load the TradingView script when the component mounts
        const loadScript = async () => {
            try {
                // Check if the script is already loaded
                if (!window.TradingView) {
                    const script = document.createElement('script');
                    script.src =
                        '/tv/charting_library/charting_library.standalone.js';
                    script.async = true;
                    script.onload = () => setIsLoaded(true);
                    document.body.appendChild(script);
                } else {
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Failed to load TradingView script:', error);
            }
        };

        loadScript();

        return () => {
            // Cleanup if needed
        };
    }, []);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--bg-dark2)',
                display: 'grid',
            }}
        >
            {isLoaded && (
                <TradingViewProvider
                    setIsChartReadyForFirstOpen={setIsChartReadyForFirstOpen}
                >
                    <TradingViewChart />
                    <OverlayCanvas />
                </TradingViewProvider>
            )}

            {(!isLoaded || !isChartReadyForFirstOpen) && <ChartLoading />}
        </div>
    );
};

export default LazyTradingView;
