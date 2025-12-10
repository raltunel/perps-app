import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum LiqChartTooltipType {
    Distribution = 'distribution',
    Level = 'level',
}

export enum LiqChartTabType {
    Distribution = 'Distribution',
    Feed = 'Feed',
}

interface LiqChartStore {
    activeTooltipType: LiqChartTooltipType;
    setActiveTooltipType: (tooltipType: LiqChartTooltipType) => void;
    focusedPrice: number;
    setFocusedPrice: (focusedPrice: number) => void;
    focusSource: string;
    setFocusSource: (focusSource: string) => void;
    activeTab: LiqChartTabType;
    setActiveTab: (activeTab: LiqChartTabType) => void;
    showLiqOverlayAlways: boolean;
    setShowLiqOverlayAlways: (showLiqOverlayAlways: boolean) => void;
    showLiqOptions: boolean;
    setShowLiqOptions: (showLiqOptions: boolean) => void;
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
            activeTab: LiqChartTabType.Distribution,
            setActiveTab: (activeTab: LiqChartTabType) =>
                set({ activeTab: activeTab }),
            showLiqOverlayAlways: false,
            setShowLiqOverlayAlways: (showLiqOverlayAlways: boolean) =>
                set({ showLiqOverlayAlways }),
            showLiqOptions: false,
            setShowLiqOptions: (showLiqOptions: boolean) =>
                set({ showLiqOptions }),
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({}),
        },
    ),
);
