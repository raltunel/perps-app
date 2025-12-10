import styles from './FogoPresaleBanner.module.css';
import {
    PresaleBannerMedium,
    PresaleBannerNarrow,
    PresaleBannerWide,
} from '~/assets';
import { useClickableSVG } from '~/hooks/useClickableSVG';
import useMediaQuery from '~/hooks/useMediaQuery';

export default function FogoPresaleBanner() {
    // fn to open the presale link in a new tab
    function goToPresale(): void {
        window.open(
            'https://presale.fogo.io/',
            '_blank',
            'noopener,noreferrer',
        );
    }

    // hooks to attach click handlers to SVGs
    const bannerWide = useClickableSVG(
        'fogo-presale-banner-wide-clickable',
        () => goToPresale(),
    );
    const bannerMedium = useClickableSVG(
        'fogo-presale-banner-medium-clickable',
        () => goToPresale(),
    );
    const bannerNarrow = useClickableSVG(
        'fogo-presale-banner-narrow-clickable',
        () => goToPresale(),
    );

    // screen width breakpoints (px) to change the SVG in the active DOM
    const MIN_VP_WIDTH_FOR_LARGE_BANNER = 1440;
    const MIN_VP_WIDTH_FOR_MEDIUM_BANNER = 440;

    // media query hooks to determine which elem should be displayed
    const is1440pxOrLarger = useMediaQuery(
        `(min-width: ${MIN_VP_WIDTH_FOR_LARGE_BANNER}px)`,
    );
    const is440pxOrLarger = useMediaQuery(
        `(min-width: ${MIN_VP_WIDTH_FOR_MEDIUM_BANNER}px)`,
    );

    return (
        <div className={styles.fogo_header_banner_wrapper}>
            <object
                ref={bannerWide.ref}
                type='image/svg+xml'
                data={PresaleBannerWide}
                style={{ display: is1440pxOrLarger ? 'block' : 'none' }}
            />
            <object
                ref={bannerMedium.ref}
                type='image/svg+xml'
                data={PresaleBannerMedium}
                style={{
                    display:
                        !is1440pxOrLarger && is440pxOrLarger ? 'block' : 'none',
                }}
            />
            <object
                ref={bannerNarrow.ref}
                type='image/svg+xml'
                data={PresaleBannerNarrow}
                style={{
                    display:
                        !is1440pxOrLarger && !is440pxOrLarger
                            ? 'block'
                            : 'none',
                }}
            />
        </div>
    );
}
