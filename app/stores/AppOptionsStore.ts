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
    toggle: (o: appOptions) => void;
}

const LS_KEY = 'APP_OPTIONS';

export const useAppOptions = create<useAppOptionsIF>()(
    persist(
        (set, get) => ({
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
            enable: (o: appOptions) => set({[o]: true}),
            disable: (o: appOptions) => set({[o]: false}),
            toggle: (o: appOptions) => set({[o]: !get()[o]}),
        }),
        {
            name: LS_KEY,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)