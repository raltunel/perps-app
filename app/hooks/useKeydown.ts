import { useEffect } from 'react';

// hook to create and manage a 'keydown' event in the DOM
export function useKeydown(
    // keybind for the triggered event
    key: string,
    // fn to execute on keydown
    fn: () => void,
    // param to toggle on debug mode
    debug?: 'debug'
): () => void {
    // listener to execute functionality on the appropriate keypress
    function listener(trigger: KeyboardEvent): void {
        // console log for debug mode
        debug && console.log({
            event: trigger,
            event_key: trigger.key,
            bound_key: key,
            fn: fn,
            fn_will_execute: trigger.key === key,
        });
        // execute functionality if keypress was appropriate
        trigger.key === key && fn();
    }
    // hook to manage the event listener in the DOM
    useEffect(() => {
        // console log for debug mode
        debug && console.log('adding event listener', {
            event: 'keydown',
            key: key,
            fn: fn,
        });
        // add the event listener when the component mounts
        document.addEventListener('keydown', listener);
        // remove the event listener when the component dismounts
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, []);
    // return a function to simulate a keydown for testing
    return () => document.dispatchEvent(new KeyboardEvent('keydown', { key }));
}