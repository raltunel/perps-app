import { useEffect } from 'react';

// hook to create and manage a 'keydown' event in the DOM
export function useKeydown(
    // keybind for the triggered event
    key: string,
    // fn to execute on keydown
    fn: () => void,
): () => void {
    // listener to execute functionality on the appropriate keypress
    function listener(trigger: KeyboardEvent): void {
        trigger.key === key && fn();
    }
    // hook to manage the event listener in the DOM
    useEffect(() => {
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