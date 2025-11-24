import React, { useState } from 'react';
import styles from './symbolInfoMobile.module.css';
import SymbolSearch from './symbolsearch/symbolsearch';
import {
    useSymbolInfoFields,
    type SymbolInfoFieldConfig,
} from './useSymbolInfoFields';
import Modal from '~/components/Modal/Modal';
import { useAppSettings } from '~/stores/AppSettingsStore';

import { MdExpandMore } from 'react-icons/md';

const SymbolInfoMobile: React.FC = () => {
    const { fieldConfigs } = useSymbolInfoFields({ isMobile: true });
    const { getBsColor } = useAppSettings();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const topRow = fieldConfigs.slice(0, 4);
    const bottomRow = fieldConfigs.slice(4, 7);

    const getValueColor = (field: SymbolInfoFieldConfig) => {
        if (field.type === 'positive') return getBsColor().buy;
        if (field.type === 'negative') return getBsColor().sell;
        return 'var(--text1)';
    };

    const renderInlineField = (field: SymbolInfoFieldConfig) => (
        <div key={field.key} className={styles.InfoField}>
            <p className={styles.fieldLabel}>
                {field.labelMobile ?? field.label}:
            </p>
            <p
                className={styles.fieldValue}
                style={{ color: getValueColor(field) }}
            >
                {field.value}
            </p>
        </div>
    );

    const ModalContent = (
        <div className={styles.moreModal}>
            <div className={styles.moreModalGrid}>
                {fieldConfigs.map((field) => (
                    <div key={field.key} className={styles.moreCard}>
                        <p className={styles.moreLabel}>{field.label}</p>

                        <p
                            className={styles.moreValue}
                            style={{ color: getValueColor(field) }}
                        >
                            {field.fullValue ?? field.value}
                        </p>

                        {field.tooltipContent && (
                            <p className={styles.moreTooltipText}>
                                {typeof field.tooltipContent === 'string'
                                    ? field.tooltipContent
                                    : null}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div
                className={styles.container}
                onClick={() => setIsMoreOpen(true)}
            >
                <div
                    className={styles.symbolSelector}
                    id='tutorial-pool-explorer'
                >
                    <SymbolSearch />
                </div>

                <div className={styles.InfoFieldContainer}>
                    <section className={styles.infoFieldRow}>
                        {topRow.map(renderInlineField)}
                    </section>

                    <section
                        className={`${styles.infoFieldRow} ${styles.bottomRow}`}
                    >
                        <div className={styles.infoFieldRow}>
                            {bottomRow.map(renderInlineField)}
                        </div>
                    </section>
                </div>
                <MdExpandMore size={18} />
            </div>

            {isMoreOpen && (
                <Modal
                    title='Market Details'
                    close={() => setIsMoreOpen(false)}
                >
                    {ModalContent}
                </Modal>
            )}
        </>
    );
};

export default SymbolInfoMobile;
