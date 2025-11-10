import { useEffect, useState, useRef } from 'react';
import LineChart from '~/components/LineChart/LineChart';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useUserDataStore } from '~/stores/UserDataStore';
import type { UserPositionIF } from '~/utils/UserDataIFs';
import CollateralPieChart from '../CollateralChart/CollateralPieChart';
import { positionDataMap } from './LineChartData';

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
}

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
    } = props;

    const { userAddress } = useUserDataStore();

    const { fetchUserPortfolio } = useInfoApi();

    const [parsedKey, setParsedKey] = useState<string>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [chartWidth, setChartWidth] = useState<number>(800); // Will be recalculated on mount
    const [chartHeight, setChartHeight] = useState<number>(250); // Default base height

    const parseFakeUserData = (key: string) => {
        const userPositionData = positionDataMap.get(key);

        if (userPositionData !== undefined) {
            setAccountValueHistory(() => userPositionData.accountValueHistory);
            setPnlHistory(() => userPositionData.pnlHistory);

            setParsedKey(() => key);
        }
    };

    const parseUserProfileData = (data: any, key: string) => {
        const userPositionData = data.get(key) as UserPositionIF;

        if (userPositionData.accountValueHistory) {
            const accountValueHistory =
                userPositionData.accountValueHistory.map((accountValue) => {
                    return {
                        time: accountValue[0],
                        value: Number(accountValue[1]),
                    };
                });

            setAccountValueHistory(() => accountValueHistory);
        }

        if (userPositionData.pnlHistory) {
            const pnlHistory = userPositionData.pnlHistory.map((pnlValue) => {
                return {
                    time: pnlValue[0],
                    value: Number(pnlValue[1]),
                };
            });

            setPnlHistory(() => pnlHistory);
        }

        setParsedKey(() => key);
    };

    useEffect(() => {
        if (userAddress && !isLineDataFetched) {
            fetchUserPortfolio(userAddress).then((data) => {
                setUserProfileLineData(() => data);

                handleLineDataFetched(true);
            });
        }
    }, [userAddress, isLineDataFetched]);

    useEffect(() => {
        const key =
            selectedVault.value === 'perp'
                ? 'perp' + selectedPeriod.value
                : selectedPeriod.value === 'AllTime'
                  ? 'allTime'
                  : selectedPeriod.value?.toLowerCase();

        // if (key !== parsedKey && userProfileLineData) {
        //     parseUserProfileData(userProfileLineData, key);
        // }

        // fake data parser

        if (key !== parsedKey) {
            parseFakeUserData(key);
        }
    }, [
        userProfileLineData,
        selectedVault.value,
        selectedPeriod.value,
        activeTab,
    ]);

    // Track both window and container resize
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateChartDimensions = () => {
            const containerHeight = container.clientHeight;
            const containerWidth = container.clientWidth;

            const header = document.getElementById(
                'portfolio-header-container',
            );
            const headerWidth = header ? header.clientWidth : 0;

            // Width calculation: use window width logic for consistency
            const width = window.innerWidth;
            if (headerWidth > 1250) {
                setChartWidth(Math.max(850 - (1250 - width), 250));
            } else {
                setChartWidth(
                    Math.max(
                        Math.min(containerWidth - 50, headerWidth - 50),
                        250,
                    ),
                );
            }

            // Height calculation: use container height instead of window height
            // This allows the chart to resize with the panel
            const minHeight = 100;

            // Calculate available height (subtract smaller padding for tabs/header only)
            // Reduced from 150 to 80 to give charts more room
            const availableHeight = containerHeight - 80;

            // Don't cap at 250px - let it grow with available space
            setChartHeight(Math.max(availableHeight, minHeight));
        };

        // Initial calculation
        updateChartDimensions();

        // Window resize listener (for actual window resizing)
        window.addEventListener('resize', updateChartDimensions);

        // ResizeObserver to watch for container size changes (for panel resizing)
        const resizeObserver = new ResizeObserver(() => {
            updateChartDimensions();
        });

        resizeObserver.observe(container);

        return () => {
            window.removeEventListener('resize', updateChartDimensions);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            {activeTab === 'Performance' && pnlHistory && (
                <LineChart
                    lineData={pnlHistory}
                    curve={'step'}
                    chartName={selectedVault.value + selectedPeriod.value}
                    height={chartHeight}
                    width={chartWidth}
                />
            )}

            {activeTab === 'Account Value' && accountValueHistory && (
                <LineChart
                    lineData={accountValueHistory}
                    curve={'step'}
                    chartName={selectedVault.value + selectedPeriod.value}
                    height={chartHeight}
                    width={chartWidth}
                />
            )}

            {activeTab === 'Collateral' && (
                <CollateralPieChart height={chartHeight} width={chartWidth} />
            )}
        </div>
    );
};

export default TabChartContext;
