import { useEffect, useState } from 'react';
import LineChart from '~/components/LineChart/LineChart';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import type { UserPositionIF } from '~/utils/UserDataIFs';
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
    } = props;

    const { debugWallet } = useDebugStore();

    const { fetchUserPortfolio } = useInfoApi();

    useEffect(() => {
        if (debugWallet.address && !isLineDataFetched) {
            fetchUserPortfolio(debugWallet.address).then((data) => {
                const key = selectedVault.value === 'perps' ? 'perps' : '';

                const userPositionData = data.get(
                    key + selectedPeriod.value,
                ) as UserPositionIF;

                if (userPositionData.accountValueHistory) {
                    const accountValueHistory =
                        userPositionData.accountValueHistory.map(
                            (accountValue) => {
                                return {
                                    time: accountValue[0],
                                    value: Number(accountValue[1]),
                                };
                            },
                        );

                    setAccountValueHistory(() => accountValueHistory);
                }

                if (userPositionData.pnlHistory) {
                    const pnlHistory = userPositionData.pnlHistory.map(
                        (pnlValue) => {
                            return {
                                time: pnlValue[0],
                                value: Number(pnlValue[1]),
                            };
                        },
                    );

                    setPnlHistory(() => pnlHistory);
                }

                handleLineDataFetched(true);
            });
        }
    }, [debugWallet.address, isLineDataFetched]);

    return (activeTab === 'Performance' && pnlHistory) ||
        (activeTab === 'Account Value' && accountValueHistory) ? (
        <LineChart
            lineData={
                activeTab === 'Account Value' ? accountValueHistory : pnlHistory
            }
        />
    ) : (
        activeTab === 'Collateral' && <CollateralPieChart />
    );
};

export default TabChartContext;
