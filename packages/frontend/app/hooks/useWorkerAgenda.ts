import { useEffect, useRef, useCallback, type RefObject } from 'react';

import webData2Worker from './../processors/workers/webdata2.worker.ts?worker';

const getWorkerPath = (type: string) => {
    switch (type) {
        case 'webData2':
            return './../processors/workers/webdata2.worker.ts';
        default:
            return '';
    }
};

const getWorker = (type: string): Worker | null => {
    switch (type) {
        case 'webData2':
            return new webData2Worker();
        default:
            return null;
    }
};
export const useWorkerAgenda = (): {
    checkCustomWorker: (type: string) => Worker | null;
} => {
    const checkCustomWorker = (type: string) => {
        // const workerPath = getWorkerPath(type);
        // if (workerPath.length > 0) {
        //     const worker = new Worker(new URL(workerPath, import.meta.url), {
        //         type: 'module',
        //     });
        //     return worker;
        // }
        // return null;

        const worker = getWorker(type);
        return worker;
    };

    return {
        checkCustomWorker,
    };
};
