import { useEffect, useState, useRef, useCallback } from 'react';
import LineChart from '~/components/LineChart/LineChart';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useUserDataStore } from '~/stores/UserDataStore';
import CollateralPieChart from '../CollateralChart/CollateralPieChart';

export interface TabChartContext {
    activeTab: string;
    selectedVault: { label: string; value: string };
    selectedPeriod: { label: string; value: string };
    isLineDataFetched: boolean;
    handleLineDataFetched: (isDataFetched: boolean) => void;
    pnlHistory: { time: number; value: number }[] | undefined;
    setPnlHistory: React.Dispatch<
        React.SetStateAction<{ time: number; value: number }[] | undefined>
    >;
    accountValueHistory: { time: number; value: number }[] | undefined;
    setAccountValueHistory: React.Dispatch<
        React.SetStateAction<{ time: number; value: number }[] | undefined>
    >;
    userProfileLineData: any;
    setUserProfileLineData: React.Dispatch<React.SetStateAction<any>>;
    panelHeight?: number;
    isMobile?: boolean;
}

// Increased mobile chart height to show full content including labels
const MOBILE_CHART_HEIGHT = 280;
const MOBILE_CHART_WIDTH_PADDING = 32;

const TabChartContext: React.FC<TabChartContext> = (props) => {
    const {
        activeTab,
        selectedVault,
        selectedPeriod,
        isLineDataFetched,
        handleLineDataFetched,
        pnlHistory,
        setPnlHistory,
        accountValueHistory,
        setAccountValueHistory,
        userProfileLineData,
        setUserProfileLineData,
        panelHeight,
        isMobile,
    } = props;

    const panelHeightRef = useRef(panelHeight);

    useEffect(() => {
        panelHeightRef.current = panelHeight;
    }, [panelHeight]);

    const { userAddress } = useUserDataStore();

    const { fetchUserHistory } = useInfoApi();

    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState<number | null>(null);
    const [chartHeight, setChartHeight] = useState<number | null>(null);
    const [isChartReady, setIsChartReady] = useState(false);

    useEffect(() => {
        if (userAddress && !isLineDataFetched && !isLoading) {
            setIsLoading(true);
            fetchUserHistory(userAddress)
                .then((data) => {
                    setPnlHistory(data.pnlHistory);
                    setAccountValueHistory(data.accountValueHistory);
                    setUserProfileLineData(data);
                    handleLineDataFetched(true);
                })
                .catch((error) => {
                    console.error('Failed to fetch user history:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [userAddress, isLineDataFetched, isLoading]);

    useEffect(() => {
        window.addEventListener('resize', calculatePanelHeight);

        return () => {
            window.removeEventListener('resize', calculatePanelHeight);
        };
    }, []);

    useEffect(() => {
        calculatePanelHeight();
    }, [panelHeight, isMobile]);

    const calculatePanelHeight = useCallback(() => {
        const isMobileView = isMobile || window.innerWidth <= 768;

        if (isMobileView) {
            setChartWidth(
                Math.max(window.innerWidth - MOBILE_CHART_WIDTH_PADDING, 250),
            );
            setChartHeight(MOBILE_CHART_HEIGHT);
            setIsChartReady(true);
            return;
        }

        if (panelHeightRef.current === undefined) return;

        const header = document.getElementById('portfolio-header-container');

        const performanceTabs = document.getElementById('performanceTabs');

        const metricsContainer = document.getElementById('metricsContainer');

        const headerHeight = header ? header.clientHeight : 30;

        const headerWidth = header ? header.clientWidth : 0;

        const metricsContainerWidth = metricsContainer
            ? metricsContainer.clientWidth
            : 0;

        const performanceTabsWidth = performanceTabs
            ? performanceTabs.clientWidth
            : 0;

        const performanceTabsHeight = performanceTabs
            ? performanceTabs.clientHeight
            : 25;

        const calculatedChartHeight =
            panelHeightRef.current - headerHeight - performanceTabsHeight - 10;

        if (
            window.innerWidth < 1280 + 50 &&
            performanceTabsWidth + 50 > window.innerWidth
        ) {
            setChartWidth(
                Math.min(
                    950,
                    Math.max(
                        window.innerWidth - metricsContainerWidth - 50,
                        250,
                    ),
                ),
            );
        } else {
            setChartWidth(Math.min(950, Math.max(headerWidth, 250)));
        }

        setChartHeight(calculatedChartHeight);
        setIsChartReady(true);
    }, [isMobile]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: isMobile ? 'auto' : '100%',
                minHeight: isMobile ? `${MOBILE_CHART_HEIGHT}px` : undefined,
                overflow: 'visible',
            }}
        >
            {isChartReady && chartWidth && chartHeight && (
                <>
                    {activeTab === 'performance' && pnlHistory && (
                        <LineChart
                            // key={`performance-${chartWidth}-${chartHeight}`}
                            lineData={pnlHistory}
                            curve={'basic'}
                            chartName={
                                selectedVault.value + selectedPeriod.value
                            }
                            height={chartHeight}
                            width={chartWidth}
                            isMobile={isMobile}
                        />
                    )}

                    {activeTab === 'accountValue' && accountValueHistory && (
                        <LineChart
                            // key={`account-${chartWidth}-${chartHeight}`}
                            lineData={accountValueHistory}
                            curve={'basic'}
                            chartName={
                                selectedVault.value + selectedPeriod.value
                            }
                            height={chartHeight}
                            width={chartWidth}
                            isMobile={isMobile}
                        />
                    )}

                    {activeTab === 'collateral' && (
                        <CollateralPieChart
                            key={`collateral-${chartWidth}-${chartHeight}`}
                            height={chartHeight}
                            width={chartWidth}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default TabChartContext;
