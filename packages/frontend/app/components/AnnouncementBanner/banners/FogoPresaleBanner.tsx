import styles from './FogoPresaleBanner.module.css';
import {
    PresaleBannerMedium,
    PresaleBannerNarrow,
    PresaleBannerWide,
} from '~/assets';
import useMediaQuery from '~/hooks/useMediaQuery';

export default function FogoPresaleBanner() {
    const PRESALE_URL = 'https://presale.fogo.io/';

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
        <a
            href={PRESALE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.fogo_header_banner_wrapper}
        >
            <img
                src={PresaleBannerWide}
                alt='Fogo Presale Banner'
                style={{ display: is1440pxOrLarger ? 'block' : 'none' }}
            />
            <img
                src={PresaleBannerMedium}
                alt='Fogo Presale Banner'
                style={{
                    display:
                        !is1440pxOrLarger && is440pxOrLarger ? 'block' : 'none',
                }}
            />
            <img
                src={PresaleBannerNarrow}
                alt='Fogo Presale Banner'
                style={{
                    display:
                        !is1440pxOrLarger && !is440pxOrLarger
                            ? 'block'
                            : 'none',
                }}
            />
        </a>
    );
}
