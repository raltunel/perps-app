import { useEffect } from 'react';

export function useKeydown(key: string, fn: () => void): () => void {
    function listener(trigger: KeyboardEvent): void {
        trigger.key === key && fn();
    }
    useEffect(() => {
            document.addEventListener('keydown', listener);
            return () => {
                document.removeEventListener('keydown', listener);
            };
        }, [listener]);
    return () => document.dispatchEvent(new KeyboardEvent('keydown', { key }));
}