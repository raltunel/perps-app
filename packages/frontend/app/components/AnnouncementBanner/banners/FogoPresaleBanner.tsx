import styles from './FogoPresaleBanner.module.css';
import { PresaleBannerWide } from '~/assets';

export default function FogoPresaleBanner() {
    const PRESALE_URL = 'https://presale.fogo.io/';

    return (
        <a
            href={PRESALE_URL}
            target='_blank'
            rel='noopener noreferrer'
            className={styles.fogo_header_banner_wrapper}
        >
            <img src={PresaleBannerWide} alt='Fogo Presale Banner' />
        </a>
    );
}
