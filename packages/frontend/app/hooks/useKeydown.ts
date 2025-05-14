import { useEffect } from 'react';

// hook to create and manage a 'keydown' event in the DOM
export function useKeydown(
    // keybind for the triggered event
    key: string,
    // fn to execute on keydown
    fn: () => void,
    // param to toggle on debug mode
    debug?: 'debug',
): () => void {
    // type of event declared in central constant
    const EVENT_TYPE = 'keydown';
    // listener to execute functionality on the appropriate keypress
    function listener(trigger: KeyboardEvent): void {
        // console log for debug mode
        if (debug)
            console.log({
                event: trigger,
                event_key: trigger.key,
                bound_key: key,
                fn: fn,
                fn_will_execute: trigger.key === key,
            });
        // execute functionality if keypress was appropriate
        if (trigger.key === key) fn();
    }
    // hook to manage the event listener in the DOM
    useEffect(() => {
        // add the event listener when the component mounts
        document.addEventListener(EVENT_TYPE, listener);
        // remove the event listener when the component dismounts
        return () => {
            document.removeEventListener(EVENT_TYPE, listener);
        };
    }, []);
    // return a function to simulate a keydown for testing
    return () => document.dispatchEvent(new KeyboardEvent(EVENT_TYPE, { key }));
}
