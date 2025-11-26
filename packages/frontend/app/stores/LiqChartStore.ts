import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum LiqChartTooltipType {
    Distribution = 'distribution',
    Level = 'level',
}

interface LiqChartStore {
    activeTooltipType: LiqChartTooltipType;
    setActiveTooltipType: (tooltipType: LiqChartTooltipType) => void;
}

export const useLiqChartStore = create<LiqChartStore>()(
    persist(
        (set) => ({
            activeTooltipType: LiqChartTooltipType.Level,
            setActiveTooltipType: (tooltipType: LiqChartTooltipType) =>
                set({ activeTooltipType: tooltipType }),
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({}),
        },
    ),
);
