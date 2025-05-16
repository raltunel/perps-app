import React, { useState } from 'react';
import styles from './PortfolioChartHeader.module.css';
import ComboBox from '~/components/Inputs/ComboBox/ComboBox';

const PortfolioChartHeader: React.FC = () => {
    const vaultOptions = [
        { label: 'Perps', value: 'perps' },
        { label: 'Vaults', value: 'vaults' },
        { label: 'Perps + Vaults', value: 'all' },
    ];

    const periodOptions = [
        { label: '1D', value: '86400' },
        { label: '7D', value: '604800' },
        { label: '30D', value: '2592000' },
    ];

    const [selectedVault, setSelectedVault] = useState<{
        label: string;
        value: string;
    }>({ label: 'Perps', value: 'perps' });

    const [selectedPeriod, setSelectedPeriod] = useState<{
        label: string;
        value: string;
    }>({ label: '30D', value: '2592000' });

    return (
        <div className={styles.filterContainer}>
            <div className={styles.vaultFilter}>
                <ComboBox
                    value={selectedVault.label}
                    options={vaultOptions}
                    fieldName='label'
                    onChange={(value) =>
                        setSelectedVault({
                            label: value,
                            value:
                                vaultOptions.find((opt) => opt.label === value)
                                    ?.value || '',
                        })
                    }
                />
            </div>

            <div className={styles.vaultFilter}>
                <ComboBox
                    value={selectedPeriod.label}
                    options={periodOptions}
                    fieldName='label'
                    onChange={(value) =>
                        setSelectedPeriod({
                            label: value,
                            value:
                                vaultOptions.find((opt) => opt.label === value)
                                    ?.value || '',
                        })
                    }
                />
            </div>
        </div>
    );
};

export default PortfolioChartHeader;
