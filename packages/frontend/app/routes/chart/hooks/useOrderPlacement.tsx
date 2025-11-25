import { create } from 'zustand';

export interface PendingOrder {
    price: number;
    side: 'buy' | 'sell';
    timestamp: number; // to trigger even if same price/side
}

export type TradeType = 'Market' | 'Limit' | 'Stop Market' | 'Stop Limit';

interface OrderPlacementStore {
    pendingOrder: PendingOrder | null;
    showModal: boolean;
    modalData: { price: number; side: 'buy' | 'sell' } | null;
    quickMode: boolean;
    showQuickModeConfirm: boolean;
    quickModeDefaultAmount: number;
    dontAskAgainQuickMode: boolean;
    quickModeTradeType: TradeType;
    placeOrder: (price: number, side: 'buy' | 'sell') => void;
    clearPendingOrder: () => void;
    openModal: (price: number, side: 'buy' | 'sell') => void;
    closeModal: () => void;
    confirmOrder: (price: number, amount: number) => void;
    toggleQuickMode: () => void;
    setQuickModeTradeType: (tradeType: TradeType) => void;
    openQuickModeConfirm: () => void;
    closeQuickModeConfirm: () => void;
    confirmQuickMode: (amount: number, dontAskAgain: boolean) => void;
}

export const useOrderPlacementStore = create<OrderPlacementStore>((set) => ({
    pendingOrder: null,
    showModal: false,
    modalData: null,
    quickMode: false,
    showQuickModeConfirm: false,
    quickModeDefaultAmount: 0,
    dontAskAgainQuickMode: false,
    quickModeTradeType: 'Limit',
    placeOrder: (price: number, side: 'buy' | 'sell') => {
        set({ pendingOrder: { price, side, timestamp: Date.now() } });
    },
    clearPendingOrder: () => set({ pendingOrder: null }),
    openModal: (price: number, side: 'buy' | 'sell') => {
        set({ showModal: true, modalData: { price, side } });
    },
    closeModal: () => {
        set({ showModal: false, modalData: null });
    },
    confirmOrder: (price: number, amount: number) => {
        const side = useOrderPlacementStore.getState().modalData?.side || 'buy';
        set({
            pendingOrder: { price, side, timestamp: Date.now() },
            showModal: false,
            modalData: null,
        });
    },
    toggleQuickMode: () => {
        const state = useOrderPlacementStore.getState();
        if (!state.quickMode) {
            if (
                state.dontAskAgainQuickMode &&
                state.quickModeDefaultAmount > 0
            ) {
                set({ quickMode: true });
            } else {
                set({ showQuickModeConfirm: true });
            }
        } else {
            set({ quickMode: false });
        }
    },
    setQuickModeTradeType: (tradeType: TradeType) => {
        set({ quickModeTradeType: tradeType });
    },
    openQuickModeConfirm: () => set({ showQuickModeConfirm: true }),
    closeQuickModeConfirm: () => set({ showQuickModeConfirm: false }),
    confirmQuickMode: (amount: number, dontAskAgain: boolean) => {
        set({
            quickMode: true,
            showQuickModeConfirm: false,
            quickModeDefaultAmount: amount,
            dontAskAgainQuickMode: dontAskAgain,
        });
    },
}));
