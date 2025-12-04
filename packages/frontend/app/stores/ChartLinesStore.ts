import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChartLayout } from '~/routes/chart/data/utils/utils';
import type { LineData } from '~/routes/chart/orders/component/LineComponent';

export const CHART_LINES_KEY = 'perps.tv.chart.lines';

interface ChartLinesStore {
    previewLines: LineData[];
    setPreviewLines: (lines: LineData[]) => void;
}

export const useChartLinesStore = create<ChartLinesStore>((set) => ({
    previewLines: [],
    setPreviewLines: (lines: LineData[]) => set({ previewLines: lines }),
}));
