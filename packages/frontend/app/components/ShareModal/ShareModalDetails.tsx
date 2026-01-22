import { useMemo } from 'react';
import { tokenBackgroundMap } from '~/assets/tokens/tokenBackgroundMap';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { PositionIF } from '~/utils/position/PositionIFs';
import styles from './ShareModalDetails.module.css';
import { t } from 'i18next';

interface ShareModalDetailsProps {
    position: PositionIF;
    coinIconBase64?: string | null;
}

export default function ShareModalDetails({
    position,
    coinIconBase64,
}: ShareModalDetailsProps) {
    const { formatNum } = useNumFormatter();
    const { coinPriceMap } = useTradeDataStore();

    const symbolFileName = useMemo<string>(() => {
        const match = position.coin.match(/^k([A-Z]+)$/);
        return match ? match[1] : position.coin;
    }, [position.coin]);

    const bgType = tokenBackgroundMap[position.coin.toUpperCase()] || 'light';

    const markPrice = coinPriceMap.get(position.coin) ?? 0;
    const returnOnEquity = position.returnOnEquity;
    const fundingToShow = position.cumFunding?.sinceOpen
        ? position.cumFunding.sinceOpen * -1
        : 0;

    // Use base64 version if provided, otherwise fall back to URL
    const coinIconUrl = `https://app.hyperliquid.xyz/coins/${symbolFileName}.svg`;
    const displayCoinIcon = coinIconBase64 || coinIconUrl;

    const detailsData = useMemo(
        () => [
            {
                label: t('tradeTable.size'),
                value: `${Math.abs(position.szi)} ${position.coin}`,
                color: position.szi >= 0 ? 'var(--green)' : 'var(--red)',
            },
            {
                label: t('tradeTable.positionValue'),
                value: formatNum(position.positionValue, null, true, true),
            },
            {
                label: t('tradeTable.entryPrice'),
                value: formatNum(position.entryPx),
            },
            {
                label: t('tradeTable.markPrice'),
                value: formatNum(markPrice),
            },
            {
                label: t('tradeTable.pnl'),
                value: `${formatNum(position.unrealizedPnl, 2, true, true, true)} (${formatNum(returnOnEquity * 100, 1, false, false, true)}%)`,
                color:
                    position.unrealizedPnl > 0
                        ? 'var(--green)'
                        : position.unrealizedPnl < 0
                          ? 'var(--red)'
                          : 'var(--text2)',
            },
            {
                label: t('transactions.liquidationPrice'),
                value:
                    position.liquidationPx === null
                        ? '-'
                        : position.liquidationPx <= 0
                          ? '0'
                          : position.liquidationPx > 1_000_000
                            ? '>' + formatNum(1_000_000)
                            : formatNum(position.liquidationPx),
            },
            {
                label: t('tradeTable.margin'),
                value: formatNum(position.marginUsed, 2),
            },
            {
                label: t('common.leverage'),
                value: `${Math.floor(position.leverage?.value || 1)}x`,
            },
            {
                label: t('tradeTable.funding'),
                value: formatNum(fundingToShow, 2, true, true, true),
                color:
                    fundingToShow > 0
                        ? 'var(--green)'
                        : fundingToShow < 0
                          ? 'var(--red)'
                          : 'var(--text2)',
            },
        ],
        [position, formatNum, markPrice, returnOnEquity, fundingToShow],
    );

    return (
        <div className={styles.container}>
            {/* Position Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div
                        className={styles.symbolIcon}
                        style={{
                            background: `var(--${bgType === 'light' ? 'text1' : 'bg-dark1'})`,
                        }}
                    >
                        <img src={displayCoinIcon} alt={symbolFileName} />
                    </div>
                    <span className={styles.coin}>{position.coin}</span>
                    <div
                        className={styles.badge}
                        style={{
                            color: `var(--${position.szi > 0 ? 'green' : 'red'})`,
                            backgroundColor: `var(--${position.szi > 0 ? 'green' : 'red'}-dark)`,
                        }}
                    >
                        {(position.szi > 0
                            ? t('tradeTable.long')
                            : t('tradeTable.short')) +
                            ' ' +
                            Math.floor(position.leverage?.value || 1)}
                        x
                    </div>
                </div>
                <div
                    className={styles.pnl}
                    style={{
                        color: `var(--${returnOnEquity > 0 ? 'green' : 'red'})`,
                    }}
                >
                    {returnOnEquity > 0 && '+'}
                    {formatNum(returnOnEquity * 100, 1)}%
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.grid}>
                {detailsData.map((item, index) => (
                    <div key={index} className={styles.stat}>
                        <span className={styles.label}>{item.label}</span>
                        <span
                            className={styles.value}
                            style={item.color ? { color: item.color } : {}}
                        >
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
