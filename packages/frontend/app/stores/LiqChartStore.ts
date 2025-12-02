import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum LiqChartTooltipType {
    Distribution = 'distribution',
    Level = 'level',
}

interface LiqChartStore {
    activeTooltipType: LiqChartTooltipType;
    setActiveTooltipType: (tooltipType: LiqChartTooltipType) => void;
    focusedPrice: number;
    setFocusedPrice: (focusedPrice: number) => void;
    focusSource: string;
    setFocusSource: (focusSource: string) => void;
}

export const useLiqChartStore = create<LiqChartStore>()(
    persist(
        (set) => ({
            activeTooltipType: LiqChartTooltipType.Level,
            setActiveTooltipType: (tooltipType: LiqChartTooltipType) =>
                set({ activeTooltipType: tooltipType }),
            focusedPrice: 0,
            setFocusedPrice: (focusedPrice: number) =>
                set({ focusedPrice: focusedPrice }),
            focusSource: '',
            setFocusSource: (focusSource: string) =>
                set({ focusSource: focusSource }),
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({}),
        },
    ),
);
