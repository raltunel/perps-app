import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

type options = 
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

type useAppOptionsIF = {
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
    enable: (o: options) => void;
    disable: (o: options) => void;
    toggle: (o: options) => void;
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
            enable: (o: options) => {
                o === 'skipOpenOrderConfirm' && set({skipOpenOrderConfirm: true});
                o === 'skipClosePositionConfirm' && set({skipClosePositionConfirm: true});
                o === 'optOutSpotDusting' && set({optOutSpotDusting: true});
                o === 'persistTradingConnection' && set({persistTradingConnection: true});
                o === 'displayVerboseErrors' && set({displayVerboseErrors: true});
                o === 'enableBackgroundFillNotif' && set({enableBackgroundFillNotif: true});
                o === 'playFillSound' && set({playFillSound: true});
                o === 'animateOrderBook' && set({animateOrderBook: true});
                o === 'clickToSetOrderBookSize' && set({clickToSetOrderBookSize: true});
                o === 'showBuysSellsOnChart' && set({showBuysSellsOnChart: true});
                o === 'showPnL' && set({showPnL: true});
                o === 'showAllWarnings' && set({showAllWarnings: true});
            },
            disable: (o: options) => {
                o === 'skipOpenOrderConfirm' && set({skipOpenOrderConfirm: false});
                o === 'skipClosePositionConfirm' && set({skipClosePositionConfirm: false});
                o === 'optOutSpotDusting' && set({optOutSpotDusting: false});
                o === 'persistTradingConnection' && set({persistTradingConnection: false});
                o === 'displayVerboseErrors' && set({displayVerboseErrors: false});
                o === 'enableBackgroundFillNotif' && set({enableBackgroundFillNotif: false});
                o === 'playFillSound' && set({playFillSound: false});
                o === 'animateOrderBook' && set({animateOrderBook: false});
                o === 'clickToSetOrderBookSize' && set({clickToSetOrderBookSize: false});
                o === 'showBuysSellsOnChart' && set({showBuysSellsOnChart: false});
                o === 'showPnL' && set({showPnL: false});
                o === 'showAllWarnings' && set({showAllWarnings: false});
            },
            toggle: (o: options) => {
                o === 'skipOpenOrderConfirm' && set({skipOpenOrderConfirm: !get()[o]});
                o === 'skipClosePositionConfirm' && set({skipClosePositionConfirm: !get()[o]});
                o === 'optOutSpotDusting' && set({optOutSpotDusting: !get()[o]});
                o === 'persistTradingConnection' && set({persistTradingConnection: !get()[o]});
                o === 'displayVerboseErrors' && set({displayVerboseErrors: !get()[o]});
                o === 'enableBackgroundFillNotif' && set({enableBackgroundFillNotif: !get()[o]});
                o === 'playFillSound' && set({playFillSound: !get()[o]});
                o === 'animateOrderBook' && set({animateOrderBook: !get()[o]});
                o === 'clickToSetOrderBookSize' && set({clickToSetOrderBookSize: !get()[o]});
                o === 'showBuysSellsOnChart' && set({showBuysSellsOnChart: !get()[o]});
                o === 'showPnL' && set({showPnL: !get()[o]});
                o === 'showAllWarnings' && set({showAllWarnings: !get()[o]});
            },
        }),
        {
            name: LS_KEY,
            storage: createJSONStorage(() => localStorage),
        },
    ),
)