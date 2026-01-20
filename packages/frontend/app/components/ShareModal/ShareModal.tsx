import { useMemo, useRef, useState } from 'react';
import { RiTwitterFill } from 'react-icons/ri';
import { LuInfo, LuShare2 } from 'react-icons/lu';
import { tokenBackgroundMap } from '~/assets/tokens/tokenBackgroundMap';
import useNumFormatter from '~/hooks/useNumFormatter';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import {
    FOGO_TWITTER,
    PERPS_TWITTER,
    TWITTER_CHARACTER_LIMIT,
} from '~/utils/Constants';
import type { PositionIF } from '~/utils/position/PositionIFs';
import Modal from '../Modal/Modal';
import ShareModalDetails from './ShareModalDetails';
import perpsLogo from './perpsLogo.png';
import styles from './ShareModal.module.css';
import { t } from 'i18next';

type ViewMode = 'share' | 'details';

interface propsIF {
    close: () => void;
    position: PositionIF;
    initialTab?: ViewMode;
}

export default function ShareModal(props: propsIF) {
    const { close, position, initialTab = 'share' } = props;

    const [viewMode, setViewMode] = useState<ViewMode>(initialTab);

    const memPosition = useMemo<PositionIF>(() => position, []);

    const { formatNum } = useNumFormatter();
    const { coinPriceMap } = useTradeDataStore();

    const TEXTAREA_ID_FOR_DOM = 'share_card_custom_text';

    const inputRef = useRef<HTMLTextAreaElement>(null);

    const symbolFileName = useMemo<string>(() => {
        const match = position.coin.match(/^k([A-Z]+)$/);
        return match ? match[1] : position.coin;
    }, [position]);

    const bgType =
        tokenBackgroundMap[memPosition.coin.toUpperCase()] || 'light';

    const referralLink = 'https://perps.ambient.finance';

    const returnOnEquity = useMemo(() => {
        return memPosition.returnOnEquity;
    }, [memPosition]);

    const markPrice = coinPriceMap.get(memPosition.coin) ?? 0;

    function openShareOnX(text: string, referralLink: string) {
        const width = 550;
        const height = 420;

        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
            'https://x.com/intent/tweet?text=' +
                encodeURIComponent(text) +
                ' ' +
                encodeURIComponent(referralLink),
            'tweetWindow',
            `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes`,
        );

        if (typeof plausible === 'function') {
            plausible('External Link Clicked', {
                props: {
                    location: 'share-modal',
                    linkType: 'Share on Twitter',
                    url: 'https://x.com/intent/tweet',
                },
            });
        }
    }

    return (
        <Modal title='' close={close}>
            <div className={styles.container}>
                <section className={styles.leftSide}>
                    <img
                        src={perpsLogo}
                        alt='Perps logo'
                        className={styles.perpsLogo}
                    />

                    <div className={styles.leftContent}>
                        {viewMode === 'details' ? (
                            <ShareModalDetails position={memPosition} />
                        ) : (
                            <div className={styles.marketInfoContainer}>
                                <div className={styles.market}>
                                    <div className={styles.market_tkn}>
                                        <div
                                            className={styles.symbol_icon}
                                            style={{
                                                background: `var(--${bgType === 'light' ? 'text1' : 'bg-dark1'})`,
                                            }}
                                        >
                                            <img
                                                src={`https://app.hyperliquid.xyz/coins/${symbolFileName}.svg`}
                                                alt={symbolFileName}
                                            />
                                        </div>
                                        <div className={styles.symbol}>
                                            {memPosition.coin}
                                        </div>
                                        <div
                                            className={styles.yield}
                                            style={{
                                                color: `var(--${memPosition.szi > 0 ? 'green' : 'red'})`,
                                                backgroundColor: `var(--${memPosition.szi > 0 ? 'green' : 'red'}-dark)`,
                                            }}
                                        >
                                            {(memPosition.szi > 0
                                                ? t('tradeTable.long')
                                                : t('tradeTable.short')) +
                                                ' ' +
                                                Math.floor(
                                                    memPosition.leverage.value,
                                                )}
                                            x
                                        </div>
                                    </div>
                                    <div
                                        className={styles.market_pct}
                                        style={{
                                            color: `var(--${returnOnEquity > 0 ? 'green' : 'red'})`,
                                        }}
                                    >
                                        {returnOnEquity > 0 && '+'}
                                        {formatNum(returnOnEquity * 100, 1)}%
                                    </div>
                                </div>
                                <div className={styles.prices}>
                                    <div className={styles.price}>
                                        <div>{t('tradeTable.entryPrice')}</div>
                                        <div>
                                            {formatNum(memPosition.entryPx)}
                                        </div>
                                    </div>
                                    <div className={styles.price}>
                                        <div>{t('tradeTable.markPrice')}</div>
                                        <div>{formatNum(markPrice)}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <section className={styles.rightSide}>
                    {/* View Toggle */}
                    <div className={styles.view_toggle}>
                        <button
                            className={`${styles.toggle_btn} ${viewMode === 'share' ? styles.active : ''}`}
                            onClick={() => setViewMode('share')}
                        >
                            <LuShare2 size={16} />
                            {t('share.share') || 'Share'}
                        </button>
                        <button
                            className={`${styles.toggle_btn} ${viewMode === 'details' ? styles.active : ''}`}
                            onClick={() => setViewMode('details')}
                        >
                            <LuInfo size={16} />
                            {t('share.details') || 'Details'}
                        </button>
                    </div>

                    <div className={styles.custom_text}>
                        <label htmlFor={TEXTAREA_ID_FOR_DOM}>
                            {t('share.prompt')}
                        </label>
                        <textarea
                            id={TEXTAREA_ID_FOR_DOM}
                            ref={inputRef}
                            maxLength={TWITTER_CHARACTER_LIMIT}
                            autoComplete='false'
                            defaultValue={t('share.textPlaceholder', {
                                coin: memPosition.coin,
                                twitter: PERPS_TWITTER,
                                fogo: FOGO_TWITTER,
                            })}
                        />
                    </div>

                    <div className={styles.button_bank}>
                        <button
                            onClick={() => {
                                if (!inputRef.current) return;
                                openShareOnX(
                                    inputRef.current.value,
                                    referralLink,
                                );
                            }}
                        >
                            {t('share.xCTA')} <RiTwitterFill />
                        </button>
                    </div>
                </section>
            </div>
        </Modal>
    );
}
