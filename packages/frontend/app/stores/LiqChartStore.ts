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

export type LiqLevel = {
    id: number;
    label: string;
    color: string;
    minRatio?: number;
};

const defaultLiqLevels = [
    { id: 3, label: 'Level 4', color: '#FDE725', minRatio: 80 }, // Yellow - highest
    { id: 2, label: 'Level 3', color: '#2BAE7D', minRatio: 70 }, // Green
    { id: 1, label: 'Level 2', color: '#287D8D', minRatio: 50 }, // Blue
    { id: 0, label: 'Level 1', color: '#461668' },
];
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
    minLiqValue: number | null;
    setMinLiqValue: (minLiqValue: number) => void;
    maxLiqValue: number | null;
    setMaxLiqValue: (maxLiqValue: number) => void;
    liqLevels: LiqLevel[];
    setLiqLevels: (liqLevels: LiqLevel[]) => void;
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
            minLiqValue: null,
            setMinLiqValue: (minLiqValue: number) => set({ minLiqValue }),
            maxLiqValue: null,
            setMaxLiqValue: (maxLiqValue: number) => set({ maxLiqValue }),
            liqLevels: defaultLiqLevels,
            setLiqLevels: (liqLevels: LiqLevel[]) => set({ liqLevels }),
        }),
        {
            name: 'LIQCHART',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({}),
        },
    ),
);
