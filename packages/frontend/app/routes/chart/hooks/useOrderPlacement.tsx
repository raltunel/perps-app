import { create } from 'zustand';

export interface PendingOrder {
    price: number;
    side: 'buy' | 'sell';
    timestamp: number; // to trigger even if same price/side
}

export interface PreparedOrder {
    price: number;
    side: 'buy' | 'sell';
    type: TradeType;
    size: number;
    currency: string;
    timestamp: number;
}

export type TradeType = 'Market' | 'Limit' /* | 'Stop Market' | 'Stop Limit' */;

interface OrderPlacementStore {
    pendingOrder: PendingOrder | null;
    preparedOrder: PreparedOrder | null;
    showModal: boolean;
    modalData: { price: number; side: 'buy' | 'sell' } | null;
    quickMode: boolean;
    showQuickModeConfirm: boolean;
    quickModeDefaultAmount: number;
    quickModeTradeType: TradeType;
    activeOrder: { type: TradeType; size: number; currency: string } | null;
    placeOrder: (price: number, side: 'buy' | 'sell') => void;
    clearPendingOrder: () => void;
    setPreparedOrder: (order: PreparedOrder | null) => void;
    openModal: (price: number, side: 'buy' | 'sell') => void;
    closeModal: () => void;
    confirmOrder: (order: PreparedOrder) => void;
    toggleQuickMode: () => void;
    setQuickModeTradeType: (tradeType: TradeType) => void;
    openQuickModeConfirm: () => void;
    closeQuickModeConfirm: () => void;
    confirmQuickMode: (amount: number) => void;
    resetQuickModeState: () => void;
}

export const useOrderPlacementStore = create<OrderPlacementStore>((set) => ({
    pendingOrder: null,
    preparedOrder: null,
    showModal: false,
    modalData: null,
    quickMode: false,
    showQuickModeConfirm: false,
    quickModeDefaultAmount: 0,
    quickModeTradeType: 'Limit',
    activeOrder: null,
    placeOrder: (price: number, side: 'buy' | 'sell') => {
        set({ pendingOrder: { price, side, timestamp: Date.now() } });
    },
    clearPendingOrder: () => set({ pendingOrder: null }),
    setPreparedOrder: (order: PreparedOrder | null) =>
        set({ preparedOrder: order }),
    openModal: (price: number, side: 'buy' | 'sell') => {
        set({ showModal: true, modalData: { price, side } });
    },
    closeModal: () => {
        set({ showModal: false, modalData: null });
    },
    confirmOrder: (order: PreparedOrder | null) => {
        const state = useOrderPlacementStore.getState();
        const side = state.modalData?.side || 'buy';
        set({
            pendingOrder: order,
            showModal: false,
            modalData: null,
        });
    },
    toggleQuickMode: () => {
        const state = useOrderPlacementStore.getState();

        if (!state.quickMode && !state.activeOrder) {
            set({ showQuickModeConfirm: true });
            return;
        }

        set({
            quickMode: !state.quickMode,
        });
    },
    setQuickModeTradeType: (tradeType: TradeType) => {
        set({
            quickModeTradeType: tradeType,
            activeOrder: null,
        });
    },
    openQuickModeConfirm: () => set({ showQuickModeConfirm: true }),
    closeQuickModeConfirm: () => set({ showQuickModeConfirm: false }),
    confirmQuickMode: (amount: number) => {
        const state = useOrderPlacementStore.getState();
        set({
            quickMode: true,
            showQuickModeConfirm: false,
            quickModeDefaultAmount: amount,
            activeOrder: {
                type: state.quickModeTradeType,
                size: amount,
                currency: 'USD',
            },
        });
    },
    resetQuickModeState: () => {
        set({
            quickMode: false,
            activeOrder: null,
            preparedOrder: null,
        });
    },
}));
