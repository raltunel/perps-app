import {
    PresaleBannerMedium,
    PresaleBannerNarrow,
    PresaleBannerWide,
} from '~/assets';
import styles from './testpage.module.css';
import { useRef, useEffect, type RefObject } from 'react';

/**
 * Hook to attach a click event to a sub-element of an SVG loaded via an <object> tag.
 * Not generic, written for specific temporary use case.
 *
 * @param idInDOM - DOM ID of the clickable element inside the SVG document
 * @param refObj - React ref pointing to the <object> rendering the parent SVG
 * @param action - callback fn to execute when the clickable is triggered
 */
function useBannerSVG(
    idInDOM: string,
    refObj: RefObject<HTMLObjectElement | null>,
    action: () => void,
): void {
    useEffect(() => {
        // variable to hold current value of ref object
        const objectEl = refObj.current;
        // exit fn if there is no element (value is `null` until rendered)
        if (!objectEl) return;

        // fn to execute when the SVG completes loading
        const handleLoad = (): void => {
            const svgDoc = objectEl.contentDocument;
            const rect = svgDoc?.getElementById(idInDOM);
            if (rect) {
                const handleClick: () => void = action;
                rect.addEventListener('click', handleClick);
                rect.style.cursor = 'pointer';
            }
        };

        const EVENT_TRIGGER = 'load';

        // when obj (SVG) finsihes loading, run fn to attach click event to sub-elem
        objectEl.addEventListener(EVENT_TRIGGER, handleLoad);
        // if obj is already loaded, run the fn to attach click event
        // the above `addEventListener` will not fire if the SVG is already loaded
        if (objectEl.contentDocument?.readyState === 'complete') {
            handleLoad();
        }

        // remove the event listener when the component unmounts
        return () => objectEl.removeEventListener(EVENT_TRIGGER, handleLoad);
    }, []);
}

export default function testpage() {
    // need one ref for each SVG banner
    const bannerRefWide = useRef<HTMLObjectElement>(null);
    const bannerRefMedium = useRef<HTMLObjectElement>(null);
    const bannerRefNarrow = useRef<HTMLObjectElement>(null);

    // DOM ids for the three banners on this page
    const BANNER_DOM_IDS = {
        wide: 'fogo-presale-banner-wide-clickable',
        medium: 'fogo-presale-banner-medium-clickable',
        narrow: 'fogo-presale-banner-narrow-clickable',
    };

    // fn shell to run when user triggers a banner clickable
    function logClick(size: string): void {
        console.log(`clicked ${size} banner`);
    }

    // hook instantiations to manage click handlers in DOM
    useBannerSVG(BANNER_DOM_IDS.wide, bannerRefWide, () => logClick('wide'));
    useBannerSVG(BANNER_DOM_IDS.medium, bannerRefMedium, () =>
        logClick('medium'),
    );
    useBannerSVG(BANNER_DOM_IDS.narrow, bannerRefNarrow, () =>
        logClick('narrow'),
    );

    return (
        <div className={styles.testpage}>
            <object
                ref={bannerRefWide}
                type='image/svg+xml'
                data={PresaleBannerWide}
            />
            <object
                ref={bannerRefMedium}
                type='image/svg+xml'
                data={PresaleBannerMedium}
            />
            <object
                ref={bannerRefNarrow}
                type='image/svg+xml'
                data={PresaleBannerNarrow}
            />
        </div>
    );
}
