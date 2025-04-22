import { useEffect, useRef, useCallback, type RefObject } from 'react';
import type { WsSubscriptionConfig } from './useWsObserver';
import type { WsMsg } from '@perps-app/sdk/src/utils/types';

const getWorkerPath = (type: string) => {
    switch (type) {
        case 'webData2':
            return './../processors/workers/webdata2.worker.ts';
        default:
            return '';
    }
};

export const useWorkerAgenda = (): {
    checkCustomWorker: (type: string) => Worker | null;
} => {
    const checkCustomWorker = (type: string) => {
        const workerPath = getWorkerPath(type);
        if (workerPath.length > 0) {
            const worker = new Worker(workerPath, { type: 'module' });
            console.log('>>> worker created', worker);
            worker.onmessage = (event) => {
                console.log('>>> worker received message', event.data);
            };
            return worker;
        }
        return null;
    };

    return {
        checkCustomWorker,
    };
};
