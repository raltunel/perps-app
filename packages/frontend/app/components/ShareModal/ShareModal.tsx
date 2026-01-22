import { useMemo, useRef, useState, useEffect } from 'react';
import { RiTwitterFill } from 'react-icons/ri';
import { LuCopy, LuInfo, LuShare2 } from 'react-icons/lu';
import html2canvas from 'html2canvas';
import { tokenBackgroundMap } from '~/assets/tokens/tokenBackgroundMap';
import useNumFormatter from '~/hooks/useNumFormatter';
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
import styles from './ShareModal.module.css';
import { t } from 'i18next';

type ViewMode = 'share' | 'details';

interface propsIF {
    close: () => void;
    position: PositionIF;
    initialTab?: ViewMode;
}

// Convert image to base64 with CORS proxy fallback
async function getImageAsBase64(url: string): Promise<string | null> {
    // Skip if already base64 or data URL
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // Try direct fetch first
    try {
        const response = await fetch(url, { mode: 'cors' });
        if (response.ok) {
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        }
    } catch {
        // Direct fetch failed, try CORS proxy
    }

    // Try with CORS proxy
    try {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        if (response.ok) {
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        }
    } catch {
        // CORS proxy also failed
    }

    return null;
}

export default function ShareModal(props: propsIF) {
    const { close, position, initialTab = 'share' } = props;

    const [viewMode, setViewMode] = useState<ViewMode>(initialTab);
    const [isCopying, setIsCopying] = useState(false);
    const [coinIconBase64, setCoinIconBase64] = useState<string | null>(null);

    const memPosition = useMemo<PositionIF>(() => position, []);

    const { formatNum } = useNumFormatter();
    const { coinPriceMap } = useTradeDataStore();
    const notifications = useNotificationStore();

    const TEXTAREA_ID_FOR_DOM = 'share_card_custom_text';

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const cardRef = useRef<HTMLElement>(null);

    const symbolFileName = useMemo<string>(() => {
        const match = position.coin.match(/^k([A-Z]+)$/);
        return match ? match[1] : position.coin;
    }, [position]);

    const coinIconUrl = `https://app.hyperliquid.xyz/coins/${symbolFileName}.svg`;

    // Pre-fetch and convert coin icon to base64 on mount
    useEffect(() => {
        getImageAsBase64(coinIconUrl).then(setCoinIconBase64);
    }, [coinIconUrl]);

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

    async function copyAsImage() {
        if (!cardRef.current || isCopying) return;

        setIsCopying(true);

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#0d0d14',
                scale: 2,
                useCORS: true,
                allowTaint: false,
                logging: false,
                onclone: async (clonedDoc) => {
                    // Replace all external images with base64 versions in the clone
                    const images = clonedDoc.querySelectorAll('img');

                    await Promise.all(
                        Array.from(images).map(async (img) => {
                            const src = img.getAttribute('src');
                            if (src && !src.startsWith('data:')) {
                                const base64 = await getImageAsBase64(src);
                                if (base64) {
                                    img.src = base64;
                                }
                            }
                        }),
                    );

                    // Wait a bit for images to settle
                    await new Promise((resolve) => setTimeout(resolve, 50));
                },
            });

            canvas.toBlob(async (blob) => {
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

                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob }),
                    ]);

                    notifications.add({
                        title: t('share.imageCopied') || 'Image Copied',
                        message:
                            t('share.imageCopiedMessage') ||
                            'Position card copied to clipboard. Paste it into your tweet!',
                        icon: 'check',
                    });

                    if (typeof plausible === 'function') {
                        plausible('Share Action', {
                            props: {
                                actionType: 'Copy Image',
                                success: true,
                            },
                        });
                    }
                } catch (err) {
                    console.warn(
                        'Clipboard API not supported, downloading instead:',
                        err,
                    );

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
            }, 'image/png');
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

    // Use base64 version if available, otherwise fall back to URL
    const displayCoinIcon = coinIconBase64 || coinIconUrl;

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
                                coinIconBase64={coinIconBase64}
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
                                                src={displayCoinIcon}
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
                            className={styles.copyButton}
                            onClick={copyAsImage}
                            disabled={isCopying}
                        >
                            {isCopying ? (
                                t('share.copying') || 'Copying...'
                            ) : (
                                <>
                                    {t('share.copyImage') || 'Copy Image'}{' '}
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
