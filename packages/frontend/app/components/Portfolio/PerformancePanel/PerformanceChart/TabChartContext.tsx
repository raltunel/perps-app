import { useEffect, useState } from 'react';
import LineChart from '~/components/LineChart/LineChart';
import { useInfoApi } from '~/hooks/useInfoApi';
import { useUserDataStore } from '~/stores/UserDataStore';
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

    const accountValueHistoryMockData = [
        { time: 1356998400000, value: 1320 },
        { time: 1363595810204, value: 1405 },
        { time: 1370193220408, value: 1502 },
        { time: 1376790630612, value: 1478 },
        { time: 1383388040816, value: 1580 },
        { time: 1389985451020, value: 1602 },
        { time: 1396582861224, value: 1675 },
        { time: 1403180271428, value: 1693 },
        { time: 1409777681632, value: 1752 },
        { time: 1416375091836, value: 1824 },
        { time: 1422972502040, value: 1850 },
        { time: 1429569912244, value: 1888 },
        { time: 1436167322448, value: 1920 },
        { time: 1442764732652, value: 1985 },
        { time: 1449362142856, value: 2012 },
        { time: 1455959553060, value: 2038 },
        { time: 1462556963264, value: 2090 },
        { time: 1469154373468, value: 2142 },
        { time: 1475751783672, value: 2200 },
        { time: 1482349193876, value: 2188 },
        { time: 1488946604080, value: 2235 },
        { time: 1495544014284, value: 2257 },
        { time: 1502141424488, value: 2290 },
        { time: 1508738834692, value: 2322 },
        { time: 1515336244896, value: 2368 },
        { time: 1521933655100, value: 2345 },
        { time: 1528531065304, value: 2388 },
        { time: 1535128475508, value: 2410 },
        { time: 1541725885712, value: 2430 },
        { time: 1548323295916, value: 2402 },
        { time: 1554920706120, value: 2380 },
        { time: 1561518116324, value: 2340 },
        { time: 1568115526528, value: 2305 },
        { time: 1574712936732, value: 2262 },
        { time: 1581310346936, value: 2220 },
        { time: 1587907757140, value: 2178 },
        { time: 1594505167344, value: 2134 },
        { time: 1601102577548, value: 2110 },
        { time: 1607699987752, value: 2075 },
        { time: 1614297397956, value: 2033 },
        { time: 1620894808160, value: 1990 },
        { time: 1627492218364, value: 1954 },
        { time: 1634089628568, value: 1938 },
        { time: 1640687038772, value: 1902 },
        { time: 1647284448976, value: 1855 },
        { time: 1653881859180, value: 1810 },
        { time: 1660479269384, value: 1768 },
        { time: 1667076679588, value: 1710 },
        { time: 1673674089792, value: 1650 },
    ];

    const pnlHistoryMockData = [
        { time: 1356998400000, value: 45 },
        { time: 1363595810204, value: 62 },
        { time: 1370193220408, value: 31 },
        { time: 1376790630612, value: 78 },
        { time: 1383388040816, value: 69 },
        { time: 1389985451020, value: 88 },
        { time: 1396582861224, value: 74 },
        { time: 1403180271428, value: 93 },
        { time: 1409777681632, value: 55 },
        { time: 1416375091836, value: 46 },
        { time: 1422972502040, value: 61 },
        { time: 1429569912244, value: 72 },
        { time: 1436167322448, value: 95 },
        { time: 1442764732652, value: 84 },
        { time: 1449362142856, value: 78 },
        { time: 1455959553060, value: 63 },
        { time: 1462556963264, value: 81 },
        { time: 1469154373468, value: 98 },
        { time: 1475751783672, value: 73 },
        { time: 1482349193876, value: 57 },
        { time: 1488946604080, value: 82 },
        { time: 1495544014284, value: 66 },
        { time: 1502141424488, value: 94 },
        { time: 1508738834692, value: 71 },
        { time: 1515336244896, value: 79 },
        { time: 1521933655100, value: 100 },
        { time: 1528531065304, value: 65 },
        { time: 1535128475508, value: 52 },
        { time: 1541725885712, value: 86 },
        { time: 1548323295916, value: 44 },
        { time: 1554920706120, value: 39 },
        { time: 1561518116324, value: 96 },
        { time: 1568115526528, value: 91 },
        { time: 1574712936732, value: 32 },
        { time: 1581310346936, value: 49 },
        { time: 1587907757140, value: 55 },
        { time: 1594505167344, value: 80 },
        { time: 1601102577548, value: 74 },
        { time: 1607699987752, value: 87 },
        { time: 1614297397956, value: 43 },
        { time: 1620894808160, value: 31 },
        { time: 1627492218364, value: 69 },
        { time: 1634089628568, value: 64 },
        { time: 1640687038772, value: 39 },
        { time: 1647284448976, value: 53 },
        { time: 1653881859180, value: 76 },
        { time: 1660479269384, value: 92 },
        { time: 1667076679588, value: 48 },
        { time: 1673674089792, value: 36 },
    ];

    const { userAddress } = useUserDataStore();

    const { fetchUserPortfolio } = useInfoApi();

    const [parsedKey, setParsedKey] = useState<string>();
    const [chartWidth, setChartWidth] = useState<number>(
        window.innerWidth > 768
            ? Math.min(850, window.innerWidth - 50)
            : window.innerWidth - 50,
    );
    const [chartHeight, setChartHeight] = useState<number>(
        Math.max(250 - (870 - window.innerHeight), 100),
    );

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

        if (key !== parsedKey && userProfileLineData) {
            parseUserProfileData(userProfileLineData, key);
        }
    }, [
        userProfileLineData,
        selectedVault.value,
        selectedPeriod.value,
        activeTab,
    ]);

    window.addEventListener('resize', () => {
        const height = window.innerHeight;
        const width = window.innerWidth;

        const header = document.getElementById('portfolio-header-container');

        const headerWidth = header ? header.clientWidth : 0;

        if (headerWidth > 1250) {
            setChartWidth(() => Math.max(850 - (1250 - width), 250));
        } else {
            setChartWidth(() => headerWidth - 50);
        }

        if (height < 870) {
            setChartHeight(() => Math.max(250 - (870 - height), 100));
        } else {
            setChartHeight(() => 250);
        }
    });

    return (
        <div>
            {activeTab === 'Performance' && pnlHistoryMockData && (
                <LineChart
                    lineData={pnlHistoryMockData}
                    curve={'step'}
                    chartName={selectedVault.value + selectedPeriod.value}
                    height={chartHeight}
                    width={chartWidth}
                />
            )}

            {activeTab === 'Account Value' && accountValueHistoryMockData && (
                <LineChart
                    lineData={accountValueHistoryMockData}
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
