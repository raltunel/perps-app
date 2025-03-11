import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

export type appOptions = 
    | 'skipOpenOrderConfirm'
    | 'skipClosePositionConfirm'
    | 'optOutSpotDusting'
    | 'persistTradingConnection'
    | 'displayVerboseErrors'
    | 'enableBackgroundFillNotif'
    | 'playFillSound'
    | 'animateOrderBook'
    | 'clickToSetOrderBookSize'
    | 'showBuysSellsOnChart'
    | 'showPnL'
    | 'showAllWarnings';

export interface useAppOptionsIF {
    skipOpenOrderConfirm: boolean;
    skipClosePositionConfirm: boolean;
    optOutSpotDusting: boolean;
    persistTradingConnection: boolean;
    displayVerboseErrors: boolean;
    enableBackgroundFillNotif: boolean;
    playFillSound: boolean;
    animateOrderBook: boolean;
    clickToSetOrderBookSize: boolean;
    showBuysSellsOnChart: boolean;
    showPnL: boolean;
    showAllWarnings: boolean;
    enable: (o: appOptions) => void;
    disable: (o: appOptions) => void;
    toggle: (o: appOptions|appOptions[]) => void;
    applyDefaults: () => void;
}

const LS_KEY = 'APP_OPTIONS';

const DEFAULTS: Record<appOptions, boolean> = {
    skipOpenOrderConfirm: false,
    skipClosePositionConfirm: false,
    optOutSpotDusting: false,
    persistTradingConnection: false,
    displayVerboseErrors: false,
    enableBackgroundFillNotif: true,
    playFillSound: false,
    animateOrderBook: true,
    clickToSetOrderBookSize: true,
    showBuysSellsOnChart: true,
    showPnL: true,
    showAllWarnings: true,
}

export const useAppOptions = create<useAppOptionsIF>()(
    persist(
        (set, get) => ({
            ...DEFAULTS,
            enable: (o: appOptions): void => set({[o]: true}),
            disable: (o: appOptions): void => set({[o]: false}),
            toggle: (o: appOptions|appOptions[]): void => {
                if (typeof o === 'string') {
                    set({[o]: !get()[o]});
                }
                if (Array.isArray(o)) {
                    const changes: Partial<Record<appOptions, boolean>> = {};
                    o.forEach((opt: appOptions) => changes[opt] = !get()[opt]);
                    set(changes);
                }
            },
            applyDefaults: (): void => set(DEFAULTS),
        }),
        {
            name: LS_KEY,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)