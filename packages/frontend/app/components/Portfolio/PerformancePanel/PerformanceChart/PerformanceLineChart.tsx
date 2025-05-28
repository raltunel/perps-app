import { useEffect, useState } from 'react';
import LineChart from '~/components/LineChart/LineChart';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useDebugStore } from '~/stores/DebugStore';
import type { UserPositionIF } from '~/utils/UserDataIFs';

export interface PerformanceLineChart {
    activeTab: string;
    selectedVault: { label: string; value: string };
    selectedPeriod: { label: string; value: string };
    isLineDataFetched: boolean;
    setIsLineDataFetched: React.Dispatch<React.SetStateAction<boolean>>;
    pnlHistory: { time: number; value: number }[] | undefined;
    setPnlHistory: React.Dispatch<
        React.SetStateAction<{ time: number; value: number }[] | undefined>
    >;
    accountValueHistory: { time: number; value: number }[] | undefined;
    setAccountValueHistory: React.Dispatch<
        React.SetStateAction<{ time: number; value: number }[] | undefined>
    >;
}

const PerformanceLineChart: React.FC<PerformanceLineChart> = (props) => {
    const {
        activeTab,
        selectedVault,
        selectedPeriod,
        isLineDataFetched,
        setIsLineDataFetched,
        pnlHistory,
        setPnlHistory,
        accountValueHistory,
        setAccountValueHistory,
    } = props;

    const { debugWallet } = useDebugStore();

    const { fetchUserPortfolio } = useInfoApi();

    useEffect(() => {
        console.log(debugWallet.address && !isLineDataFetched);
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

                setIsLineDataFetched(() => true);
            });
        }
    }, [debugWallet.address, isLineDataFetched]);

    return isLineDataFetched &&
        ((activeTab === 'Performance' && pnlHistory) ||
            (activeTab === 'Account Value' && accountValueHistory)) ? (
        <LineChart
            lineData={
                activeTab === 'Account Value' ? accountValueHistory : pnlHistory
            }
        />
    ) : (
        <></>
    );
};

export default PerformanceLineChart;
