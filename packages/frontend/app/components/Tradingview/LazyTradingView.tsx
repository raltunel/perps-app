import React, { useEffect, useState } from 'react';
import { TradingViewProvider } from '~/contexts/TradingviewContext';
import TradingViewChart from '~/routes/chart/chart';
import OverlayCanvas from '~/routes/chart/overlayCanvas/overlayCanvas';

export const LazyTradingView: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

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

    if (!isLoaded) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    backgroundColor: 'var(--bg-dark2)',
                }}
            >
                <div className='loading-spinner'>Loading chart...</div>
            </div>
        );
    }

    return (
        <TradingViewProvider>
            <TradingViewChart />
            <OverlayCanvas />
        </TradingViewProvider>
    );
};

export default LazyTradingView;
