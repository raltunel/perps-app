import { useEffect, useRef, type RefObject } from 'react';

/**
 * Hook to attach a click event to a sub-element of an SVG loaded via an <object> tag.
 * Not generic, written for specific temporary use case.
 *
 * @param idInDOM - DOM ID of the clickable element inside the SVG document
 * @param action - callback fn to execute when the clickable is triggered
 */
export function useBannerSVG(
    idInDOM: string,
    action: () => void,
): {
    ref: RefObject<HTMLObjectElement | null>;
} {
    // ref pointing to the `<object>` used to render the SVG
    const bannerRef = useRef<HTMLObjectElement>(null);

    // logic to attach a click handler to the SVG once rendered
    useEffect(() => {
        // variable to hold current value of ref object
        const objectEl = bannerRef.current;
        // exit fn if there is no element (value is `null` until rendered)
        if (!objectEl) return;

        // fn to execute when the SVG completes loading
        const handleLoad = (): void => {
            try {
                const svgDoc = objectEl.contentDocument;
                const rect = svgDoc?.getElementById(idInDOM);
                if (rect) {
                    const handleClick: () => void = action;
                    rect.addEventListener('click', handleClick);
                    rect.style.cursor = 'pointer';
                } else {
                    throw new Error(
                        'failed to attach click handler to SVG element',
                    );
                }
            } catch (error) {
                console.warn(
                    'Failed to attach click handler to SVG element',
                    'DOM ID: ' + idInDOM,
                    error,
                );
            }
        };

        // adding an event listener happens in two nested stages
        // first stage attaches listener to the object element (parent SVG)
        // that listener then attaches the click `action` to the identified sub-element
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

    // returns the ref pointing to the `<object>` to make connection in DOM
    return { ref: bannerRef };
}
