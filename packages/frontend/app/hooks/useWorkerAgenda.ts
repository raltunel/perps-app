import { useEffect, useRef, useCallback, type RefObject } from 'react';

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
            const worker = new Worker(new URL(workerPath, import.meta.url), {
                type: 'module',
            });
            return worker;
        }
        return null;
    };

    return {
        checkCustomWorker,
    };
};
