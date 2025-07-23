import React, { useCallback, useMemo, useState } from 'react';
import { LuPen } from 'react-icons/lu';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import Modal from '~/components/Modal/Modal';
import ShareModal from '~/components/ShareModal/ShareModal';
import Tooltip from '~/components/Tooltip/Tooltip';
import { useModal } from '~/hooks/useModal';
import { useNumFormatter } from '~/hooks/useNumFormatter';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { PositionIF } from '~/utils/UserDataIFs';
import LeverageSliderModal from '../LeverageSliderModal/LeverageSliderModal';
import TakeProfitsModal from '../TakeProfitsModal/TakeProfitsModal';
import styles from './PositionsTable.module.css';

interface PositionsTableRowProps {
    position: PositionIF;
    openTPModal: () => void;
    closeTPModal: () => void;
}

const PositionsTableRow: React.FC<PositionsTableRowProps> = React.memo(
    (props) => {
        const navigate = useNavigate();

        const { position } = props;
        const { coinPriceMap } = useTradeDataStore();
        const { formatNum } = useNumFormatter();
        const { getBsColor, bsColor } = useAppSettings();

        const showTpSl = false;

        const modalCtrl = useModal('closed');
        const [modalContent, setModalContent] = useState<string>('share');

        // Memoize TP/SL string
        const getTpSl = useCallback(() => {
            let ret = '';
            if (position.tp && position.tp > 0) {
                ret = `${formatNum(position.tp)}`;
            } else {
                ret = '--';
            }

            if (position.sl && position.sl > 0) {
                ret = `${ret} / ${formatNum(position.sl)}`;
            } else {
                ret = `${ret} / --`;
            }
            return ret;
        }, [position.tp, position.sl, formatNum]);

        // Memoize buy/sell colors
        const { buy, sell } = useMemo(
            () => getBsColor(),
            [bsColor, getBsColor],
        );
        const baseColor = useMemo(
            () => (position.szi >= 0 ? buy : sell),
            [position.szi, buy, sell],
        );

        // Memoize hexToRgba
        const hexToRgba = useCallback((hex: string, alpha: number): string => {
            const [r, g, b] = hex
                .replace('#', '')
                .match(/.{2}/g)!
                .map((x) => parseInt(x, 16));
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }, []);

        // Memoize gradient style
        const gradientStyle = useMemo(
            () => ({
                background: `linear-gradient(
          to right,
          ${hexToRgba(baseColor, 0.8)} 0%,
          ${hexToRgba(baseColor, 0.5)} 1%,
          ${hexToRgba(baseColor, 0.2)} 2%,
          ${hexToRgba(baseColor, 0)} 4%,
          transparent 100%
        )`,
                paddingLeft: '8px',
                borderLeft: `1px solid ${baseColor}`,
            }),
            [baseColor, hexToRgba],
        );

        // Memoize modal openers
        const openShareModal = useCallback(() => {
            setModalContent('share');
            modalCtrl.open();
        }, [modalCtrl]);

        const openTpSlModal = useCallback(() => {
            setModalContent('tpsl');
            modalCtrl.open();
        }, [modalCtrl]);

        const openLeverageModal = useCallback(() => {
            setModalContent('leverage');
            modalCtrl.open();
        }, [modalCtrl]);

        // Memoize modal content
        const renderModalContent = useCallback(() => {
            if (modalContent === 'share') {
                return (
                    <ShareModal close={modalCtrl.close} position={position} />
                );
            } else if (modalContent === 'leverage') {
                return (
                    <LeverageSliderModal
                        currentLeverage={position.leverage.value}
                        maxLeverage={position.maxLeverage}
                        onClose={modalCtrl.close}
                    />
                );
            } else if (modalContent === 'tpsl') {
                return (
                    <Modal close={modalCtrl.close} title='TP/SL for Position'>
                        <TakeProfitsModal
                            closeTPModal={modalCtrl.close}
                            position={position}
                        />
                    </Modal>
                );
            }
            return null;
        }, [modalContent, modalCtrl.close, position]);

        // Memoize navigation handler
        const handleCoinClick = useCallback(() => {
            navigate(`/v2/trade/${position.coin?.toLowerCase()}`);
        }, [navigate, position.coin]);

        // Memoize funding values and tooltip
        const fundingToShow = useMemo(
            () => position.cumFunding.sinceOpen * -1,
            [position.cumFunding.sinceOpen],
        );
        const fundingTooltipMsg = useMemo(
            () =>
                `All-time: ${formatNum(position.cumFunding.allTime * -1, 2, true, true, true)} Since change: ${formatNum(position.cumFunding.sinceChange * -1, 2, true, true, true)}`,
            [
                position.cumFunding.allTime,
                position.cumFunding.sinceChange,
                formatNum,
            ],
        );

        return (
            <div
                className={`${styles.rowContainer} ${!showTpSl ? styles.noTpSl : ''}`}
            >
                <div
                    className={`${styles.cell} ${styles.coinCell}`}
                    style={gradientStyle}
                >
                    <span
                        style={{ color: baseColor, cursor: 'pointer' }}
                        onClick={handleCoinClick}
                    >
                        {position.coin}
                    </span>
                    {position.leverage.value && (
                        <span
                            className={styles.badge}
                            onClick={openLeverageModal}
                            style={{
                                color: baseColor,
                                backgroundColor: hexToRgba(baseColor, 0.15),
                            }}
                        >
                            {position.leverage.value}x
                        </span>
                    )}
                </div>
                <div
                    className={`${styles.cell} ${styles.sizeCell}`}
                    style={{
                        color: position.szi >= 0 ? buy : sell,
                    }}
                >
                    {Math.abs(position.szi)} {position.coin}
                </div>
                <div className={`${styles.cell} ${styles.positionValueCell}`}>
                    {formatNum(position.positionValue, null, true, true)}
                </div>
                <div className={`${styles.cell} ${styles.entryPriceCell}`}>
                    {formatNum(position.entryPx)}
                </div>
                <div className={`${styles.cell} ${styles.markPriceCell}`}>
                    {formatNum(coinPriceMap.get(position.coin) ?? 0)}
                </div>
                <div
                    onClick={openShareModal}
                    className={`${styles.cell} ${styles.pnlCell}`}
                    style={{
                        color:
                            position.unrealizedPnl > 0
                                ? buy
                                : position.unrealizedPnl < 0
                                  ? sell
                                  : 'var(--text2)',
                    }}
                >
                    {formatNum(position.unrealizedPnl, 2, true, true, true)} (
                    {formatNum(
                        position.returnOnEquity * 100,
                        1,
                        false,
                        false,
                        true,
                    )}
                    %)
                    <RiExternalLinkLine color='var(--text2)' />
                </div>
                <div className={`${styles.cell} ${styles.liqPriceCell}`}>
                    {formatNum(position.liquidationPx)}
                </div>
                <div className={`${styles.cell} ${styles.marginCell}`}>
                    {formatNum(position.marginUsed, 2)}
                </div>
                <div
                    className={`${styles.cell} ${styles.fundingCell}`}
                    style={{
                        color:
                            fundingToShow > 0
                                ? buy
                                : fundingToShow < 0
                                  ? sell
                                  : 'var(--text2)',
                    }}
                >
                    <Tooltip content={fundingTooltipMsg}>
                        {formatNum(fundingToShow, 2, true, true, true)}
                    </Tooltip>
                </div>
                {showTpSl && (
                    <div className={`${styles.cell} ${styles.tpslCell}`}>
                        {getTpSl()}
                        <button onClick={openTpSlModal}>
                            <LuPen color='var(--text1)' size={10} />
                        </button>
                    </div>
                )}
                <div className={`${styles.cell} ${styles.closeCell}`}>
                    <div className={styles.actionContainer}>
                        {/* <button className={styles.actionButton}>Limit</button> */}
                        <button className={styles.actionButton}>Market</button>
                    </div>
                </div>
                {modalCtrl.isOpen && renderModalContent()}
            </div>
        );
    },
);

export default PositionsTableRow;
