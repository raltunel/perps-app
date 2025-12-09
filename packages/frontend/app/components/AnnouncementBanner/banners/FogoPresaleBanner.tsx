import { PresaleBannerWide } from '~/assets';
import { useBannerSVG } from '~/routes/testpage/testpage';

export default function FogoPresaleBanner() {
    const banner = useBannerSVG('fogo-presale-banner-wide-clickable', () =>
        console.log('clicked page header banner'),
    );

    return (
        <object
            ref={banner.ref}
            type='image/svg+xml'
            data={PresaleBannerWide}
        />
    );
}
