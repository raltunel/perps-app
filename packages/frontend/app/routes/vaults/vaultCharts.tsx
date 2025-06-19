import type { VaultDetailsIF } from '~/utils/VaultIFs';
import styles from './vaultCharts.module.css';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import Tabs from '~/components/Tabs/Tabs';
import { motion } from 'framer-motion';
import LineChart from '~/components/LineChart/LineChart';
import type { UserPositionIF } from '~/utils/UserDataIFs';
interface VaultChartsProps {
    info: VaultDetailsIF | null;
}

export default function VaultCharts({ info }: VaultChartsProps) {
    const infoTabs = ['Vault Value', 'Vault PnL'];
    const [tab, setTab] = useState(infoTabs[0]);

    const lineData = [
        { time: 1743446400000, value: 101.2 },
        { time: 1743532800000, value: 102.5 },
        { time: 1743619200000, value: 100.8 },
        { time: 1743705600000, value: 99.4 },
        { time: 1743792000000, value: 101.9 },
        { time: 1743878400000, value: 103.3 },
        { time: 1743964800000, value: 104.0 },
        { time: 1744051200000, value: 102.1 },
        { time: 1744137600000, value: 100.7 },
        { time: 1744224000000, value: 99.5 },
        { time: 1744310400000, value: 98.9 },
        { time: 1744396800000, value: 97.6 },
        { time: 1744483200000, value: 99.2 },
        { time: 1744569600000, value: 100.3 },
        { time: 1744656000000, value: 101.0 },
        { time: 1744742400000, value: 102.6 },
        { time: 1744828800000, value: 104.3 },
        { time: 1744915200000, value: 105.1 },
        { time: 1745001600000, value: 103.7 },
        { time: 1745088000000, value: 102.4 },
    ];

    const [vaultHistory, setVaultHistory] = useState<
        { time: number; value: number }[] | undefined
    >();

    const [pnlHistory, setPnlHistory] = useState<
        { time: number; value: number }[] | undefined
    >();

    const [parsedKey, setParsedKey] = useState<number>();
    const [chartWidth, setChartWidth] = useState<number>(500);
    const [chartHeight, setChartHeight] = useState<number>(250);

    const parseUserProfileData = (data: any, key: number) => {
        const userPositionData = data[key][1] as UserPositionIF;

        if (userPositionData.accountValueHistory) {
            const accountValueHistory =
                userPositionData.accountValueHistory.map((accountValue) => {
                    return {
                        time: accountValue[0],
                        value: Number(accountValue[1]),
                    };
                });

            setVaultHistory(() => accountValueHistory);
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
        if (info) {
            parseUserProfileData(info?.portfolio, 0);
        }
    }, [info]);

    const renderTabContent = useCallback(() => {
        switch (tab) {
            case 'Vault Value':
                return (
                    <div className={styles.chartPlaceholder}>
                        {vaultHistory && (
                            <LineChart
                                lineData={vaultHistory}
                                curve={'step'}
                                chartName={'vaultChart'}
                                height={180}
                                width={500}
                            />
                        )}
                    </div>
                );
            case 'Vault PnL':
                return (
                    <div className={styles.chartPlaceholder}>
                        {pnlHistory && (
                            <LineChart
                                lineData={pnlHistory}
                                curve={'step'}
                                chartName={'pnlChart'}
                                height={180}
                                width={500}
                            />
                        )}
                    </div>
                );
            default:
                return <div>About</div>;
        }
    }, [tab, vaultHistory, pnlHistory]);

    return (
        <>
            <Tabs tabs={infoTabs} defaultTab={tab} onTabChange={setTab} />
            <motion.div
                key={tab}
                className={styles.content}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderTabContent()}
            </motion.div>
        </>
    );
}
