import { useEffect, useRef, useCallback } from 'react';

import webData2Worker from './workers/webdata2.worker.ts?worker';
import orderbookWorker from './workers/orderbook.worker.ts?worker';

export enum WorkerKeys {
    WEB_DATA2 = 'webData2',
    ORDERBOOK = 'orderbook',
}

export const useWorker = <T>(
    workerKey: string,
    onMessage: (event: MessageEvent<T>) => void,
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
        let worker: Worker | null = null;

        try {
            worker = getWorkerByKey(workerKey as WorkerKeys);
            if (!worker) {
                console.error("Worker couldn't be initialized");
                return;
            }

            workerRef.current = worker;

            const handleMessage = (event: MessageEvent<T>) => {
                onMessageRef.current?.(event);
            };

            const handleError = (event: ErrorEvent) => {
                console.error('Error in web worker:', event.message, event);
                onErrorRef.current?.(event);
            };

            worker.addEventListener('message', handleMessage);
            worker.addEventListener('error', handleError);

            return () => {
                console.log('Terminating worker:', workerKey);
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
    }, [workerKey]);

    const getWorkerByKey = (key: WorkerKeys): Worker | null => {
        switch (key) {
            case WorkerKeys.WEB_DATA2:
                return new webData2Worker();
            case WorkerKeys.ORDERBOOK:
                return new orderbookWorker();
            default:
                return null;
        }
    };

    const postMessage = useCallback((message: T) => {
        if (workerRef.current) {
            workerRef.current.postMessage(message);
        } else {
            console.warn('useWorker: Cannot post message, no worker.');
        }
    }, []); // relies on the stable ref so no deps here

    return postMessage;
};
