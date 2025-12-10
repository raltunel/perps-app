import styles from './FogoPresaleBanner.module.css';
import { PresaleBannerWide } from '~/assets';

export default function FogoPresaleBanner() {
    const PRESALE_URL = 'https://presale.fogo.io/';

    return (
        <div className={styles.fogo_header_banner_wrapper}>
            <a href={PRESALE_URL} target='_blank' rel='noopener noreferrer'>
                <img src={PresaleBannerWide} alt='Fogo Presale Banner' />
            </a>
        </div>
    );
}
