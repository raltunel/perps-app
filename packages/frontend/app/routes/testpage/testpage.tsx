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
    action: () => void,
): {
    ref: RefObject<HTMLObjectElement | null>;
} {
    const bannerRef = useRef<HTMLObjectElement>(null);

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

    return { ref: bannerRef };
}

export default function testpage() {
    // fn shell to run when user triggers a banner clickable
    function handleClick(size: string): void {
        console.log(`clicked ${size} banner`);
    }

    // DOM ids for the three banners on this page
    const BANNER_METADATA = {
        wide: {
            idForDOM: 'fogo-presale-banner-wide-clickable',
            action: () => handleClick('wide'),
        },
        medium: {
            idForDOM: 'fogo-presale-banner-medium-clickable',
            action: () => handleClick('medium'),
        },
        narrow: {
            idForDOM: 'fogo-presale-banner-narrow-clickable',
            action: () => handleClick('narrow'),
        },
    };

    // hook instantiations to manage click handlers in DOM
    const wideBanner = useBannerSVG(
        BANNER_METADATA.wide.idForDOM,
        BANNER_METADATA.wide.action,
    );
    const mediumBanner = useBannerSVG(
        BANNER_METADATA.medium.idForDOM,
        BANNER_METADATA.medium.action,
    );
    const narrowBanner = useBannerSVG(
        BANNER_METADATA.narrow.idForDOM,
        BANNER_METADATA.narrow.action,
    );

    return (
        <div className={styles.testpage}>
            <object
                ref={wideBanner.ref}
                type='image/svg+xml'
                data={PresaleBannerWide}
            />
            <object
                ref={mediumBanner.ref}
                type='image/svg+xml'
                data={PresaleBannerMedium}
            />
            <object
                ref={narrowBanner.ref}
                type='image/svg+xml'
                data={PresaleBannerNarrow}
            />
        </div>
    );
}
