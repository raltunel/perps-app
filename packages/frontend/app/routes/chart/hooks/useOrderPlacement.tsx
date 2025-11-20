import { create } from 'zustand';

export interface PendingOrder {
    price: number;
    side: 'buy' | 'sell';
    timestamp: number; // to trigger even if same price/side
}

interface OrderPlacementStore {
    pendingOrder: PendingOrder | null;
    placeOrder: (price: number, side: 'buy' | 'sell') => void;
    clearPendingOrder: () => void;
}

export const useOrderPlacementStore = create<OrderPlacementStore>((set) => ({
    pendingOrder: null,
    placeOrder: (price: number, side: 'buy' | 'sell') => {
        set({ pendingOrder: { price, side, timestamp: Date.now() } });
    },
    clearPendingOrder: () => set({ pendingOrder: null }),
}));
