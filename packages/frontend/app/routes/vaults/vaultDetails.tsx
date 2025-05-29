import { useParams } from 'react-router';
import styles from './vaultDetails.module.css';
import { useEffect, useState } from 'react';
import { useDebugStore } from '~/stores/DebugStore';
import WebDataConsumer from '../trade/webdataconsumer';
import TradeTable from '~/components/Trade/TradeTables/TradeTables';
import { useInfoApi } from '~/hooks/useInfoApi';
import useNumFormatter from '~/hooks/useNumFormatter';
import type { VaultDetailsIF } from '~/utils/VaultIFs';

export default function VaultDetails() {
    const { vaultAddress } = useParams<{ vaultAddress: string }>();
    const { setDebugWallet } = useDebugStore();
    const { fetchVaultDetails } = useInfoApi();

    const { formatNum } = useNumFormatter();

    const [vaultDetails, setVaultDetails] = useState<VaultDetailsIF | null>(
        null,
    );

    useEffect(() => {
        const fetch = async () => {
            if (vaultAddress) {
                const vaultDetails = await fetchVaultDetails(
                    '0x0000000000000000000000000000000000000000',
                    vaultAddress,
                );
                setVaultDetails(vaultDetails);
            }
        };
        fetch();
    }, [vaultAddress]);

    useEffect(() => {
        if (vaultAddress) {
            console.log(vaultAddress);
            setDebugWallet({
                address: vaultAddress,
                label: 'Vault',
            });
        }
    }, [vaultAddress]);

    return (
        <>
            <div className={styles.container}>
                <header>{vaultDetails?.name}</header>
                <div className={styles.vaultSection}>
                    <div className={styles.vaultCard}>
                        <div className={styles.vaultCardTitle}>TVL</div>
                        <div className={styles.vaultCardContent}>
                            {formatNum(1280000, 0, true, true)}
                        </div>
                    </div>
                    <div className={styles.vaultCard}>
                        <div className={styles.vaultCardTitle}>
                            Past Month Return
                        </div>
                        <div className={styles.vaultCardContent}>
                            {formatNum(1280000, 0, true, true)}
                        </div>
                    </div>
                    <div className={styles.vaultCard}>
                        <div className={styles.vaultCardTitle}>
                            Vault Capacity
                        </div>
                        <div className={styles.vaultCardContent}>
                            {formatNum(1280000, 0, true, true)}
                        </div>
                    </div>
                    <div className={styles.vaultCard}>
                        <div className={styles.vaultCardTitle}>
                            Your Deposits
                        </div>
                        <div className={styles.vaultCardContent}>
                            {formatNum(1280000, 0, true, true)}
                        </div>
                    </div>
                    <div className={styles.vaultCard}>
                        <div className={styles.vaultCardTitle}>
                            All-time Earned
                        </div>
                        <div className={styles.vaultCardContent}>
                            {formatNum(1280000, 0, true, true)}
                        </div>
                    </div>
                </div>
                <div className={styles.vaultSection}>
                    <div className={styles.vaultCard}></div>
                    <div className={styles.vaultCard}></div>
                </div>

                {vaultAddress && <WebDataConsumer />}
                <TradeTable />
            </div>
        </>
    );
}
