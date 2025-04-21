import { useEffect, useRef, useCallback } from 'react';

export const useWorker = (
    workerPath: string,
    onMessage: (event: MessageEvent) => void,
    onError?: (event: ErrorEvent) => void,
): ((message: any) => void) => {
    const workerRef = useRef<Worker | null>(null);
    const onMessageRef = useRef(onMessage);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        onErrorRef.current = onError;
    }, [onError]);

    useEffect(() => {
        if (!workerPath) {
            console.error('useWorker: workerPath is required.');
            return;
        }

        let worker: Worker | null = null;
        let workerUrl: URL | null = null;

        try {
            workerUrl = new URL(workerPath, import.meta.url);
            worker = new Worker(workerUrl, { type: 'module' });
            workerRef.current = worker;

            const handleMessage = (event: MessageEvent) => {
                onMessageRef.current?.(event);
            };

            const handleError = (event: ErrorEvent) => {
                console.error('Error in web worker:', event.message, event);
                onErrorRef.current?.(event);
            };

            worker.addEventListener('message', handleMessage);
            worker.addEventListener('error', handleError);

            return () => {
                console.log('Terminating worker:', workerPath);
                worker?.removeEventListener('message', handleMessage);
                worker?.removeEventListener('error', handleError);
                worker?.terminate();
                workerRef.current = null;
                worker = null;
            };
        } catch (error) {
            console.error('Failed to create worker:', error);
            onErrorRef.current?.(
                new ErrorEvent('error', {
                    error: error,
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Failed to create worker',
                }),
            );
            // cleanup if partial initialization failed
            if (worker) {
                worker.terminate();
                workerRef.current = null;
            }
            return;
        }
    }, [workerPath]);

    const postMessage = useCallback((message: any) => {
        if (workerRef.current) {
            workerRef.current.postMessage(message);
        } else {
            console.warn('useWorker: Cannot post message, no worker.');
        }
    }, []); // relies on the stable ref so no deps here

    return postMessage;
};
