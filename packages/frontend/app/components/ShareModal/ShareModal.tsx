import { useMemo, useRef, useState, useEffect } from 'react';
import { RiTwitterFill } from 'react-icons/ri';
import { LuCopy, LuInfo, LuShare2, LuCheck } from 'react-icons/lu';
import { tokenBackgroundMap } from '~/assets/tokens/tokenBackgroundMap';
import { tokenIconMap } from '~/assets/tokens/tokenIconMap';
import useNumFormatter from '~/hooks/useNumFormatter';
import useClipboard from '~/hooks/useClipboard';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useNotificationStore } from '~/stores/NotificationStore';
import {
    FOGO_TWITTER,
    PERPS_TWITTER,
    TWITTER_CHARACTER_LIMIT,
} from '~/utils/Constants';
import type { PositionIF } from '~/utils/position/PositionIFs';
import Modal from '../Modal/Modal';
import ShareModalDetails from './ShareModalDetails';
import perpsLogo from './perpsLogo.png';
import btcIcon from '~/assets/tokens/btc.svg';
import styles from './ShareModal.module.css';
import { t } from 'i18next';
import { printDomToImage } from '~/utils/functions/printDomToImage';

type ViewMode = 'share' | 'details';

interface propsIF {
    close: () => void;
    position: PositionIF;
    initialTab?: ViewMode;
}

export default function ShareModal(props: propsIF) {
    const { close, position, initialTab = 'share' } = props;

    const [viewMode, setViewMode] = useState<ViewMode>(initialTab);
    const [isCopying, setIsCopying] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const memPosition = useMemo<PositionIF>(() => position, []);

    const { formatNum } = useNumFormatter();
    const { coinPriceMap } = useTradeDataStore();
    const notifications = useNotificationStore();
    const [_, copy] = useClipboard();

    const TEXTAREA_ID_FOR_DOM = 'share_card_custom_text';

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const cardRef = useRef<HTMLElement>(null);
    const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const coinIcon = useMemo<string>(() => {
        return tokenIconMap[memPosition.coin.toUpperCase()] || btcIcon;
    }, [memPosition.coin]);

    const bgType =
        tokenBackgroundMap[memPosition.coin.toUpperCase()] || 'light';

    const referralLink = 'https://perps.ambient.finance';

    const returnOnEquity = useMemo(() => {
        return memPosition.returnOnEquity;
    }, [memPosition]);

    const markPrice = coinPriceMap.get(memPosition.coin) ?? 0;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) {
                clearTimeout(copiedTimeoutRef.current);
            }
        };
    }, []);

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

    async function copyAsImage() {
        if (!cardRef.current || isCopying) return;

        setIsCopying(true);

        try {
            const blob = await printDomToImage(cardRef.current, '#0d0d14');

            if (!blob) {
                notifications.add({
                    title: t('share.copyFailed') || 'Copy Failed',
                    message:
                        t('share.copyFailedMessage') ||
                        'Failed to generate image',
                    icon: 'error',
                });
                setIsCopying(false);
                return;
            }

            const success = await copy(blob);

            if (success) {
                // Show "Copied" state
                setShowCopied(true);

                // Clear any existing timeout
                if (copiedTimeoutRef.current) {
                    clearTimeout(copiedTimeoutRef.current);
                }

                // Reset to "Copy Image" after 2 seconds
                copiedTimeoutRef.current = setTimeout(() => {
                    setShowCopied(false);
                }, 2000);

                if (typeof plausible === 'function') {
                    plausible('Share Action', {
                        props: {
                            actionType: 'Copy Image',
                            success: true,
                        },
                    });
                }
            } else {
                // Fallback to download if clipboard fails
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${memPosition.coin}-position.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                notifications.add({
                    title: t('share.imageDownloaded') || 'Image Downloaded',
                    message:
                        t('share.imageDownloadedMessage') ||
                        'Position card saved to your downloads',
                    icon: 'check',
                });
            }

            setIsCopying(false);
        } catch (err) {
            console.error('Error capturing image:', err);
            notifications.add({
                title: t('share.copyFailed') || 'Copy Failed',
                message:
                    t('share.copyFailedMessage') || 'Failed to capture image',
                icon: 'error',
            });
            setIsCopying(false);
        }
    }

    return (
        <Modal title='' close={close}>
            <div className={styles.container}>
                <section className={styles.leftSide} ref={cardRef}>
                    <img
                        src={perpsLogo}
                        alt='Perps logo'
                        className={styles.perpsLogo}
                    />

                    <div className={styles.leftContent}>
                        {viewMode === 'details' ? (
                            <ShareModalDetails
                                position={memPosition}
                                coinIcon={coinIcon}
                            />
                        ) : (
                            <div className={styles.marketInfoContainer}>
                                <div className={styles.market}>
                                    <div className={styles.market_tkn}>
                                        <div
                                            className={styles.symbol_icon}
                                            style={{
                                                background: 'transparent',
                                            }}
                                        >
                                            <img
                                                src={coinIcon}
                                                alt={memPosition.coin}
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
                    <div className={styles.view_toggle}>
                        <button
                            className={`${styles.toggle_btn} ${viewMode === 'share' ? styles.active : ''}`}
                            onClick={() => setViewMode('share')}
                        >
                            <LuShare2 size={16} />
                            {t('share.pnl') || 'Share'}
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
                            className={styles.copyButton}
                            onClick={copyAsImage}
                            disabled={isCopying || showCopied}
                        >
                            {isCopying ? (
                                t('share.copying') || 'Copying...'
                            ) : showCopied ? (
                                <>
                                    {t('share.copied') || 'Copied'} <LuCheck />
                                </>
                            ) : (
                                <>
                                    {t('share.copyImageCTA') || 'Copy Image'}{' '}
                                    <LuCopy />
                                </>
                            )}
                        </button>
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
