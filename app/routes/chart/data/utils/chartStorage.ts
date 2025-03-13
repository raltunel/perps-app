import { loadFromLocalStorage, saveToLocalStorage } from './localStorageHelper';

export const CHART_LAYOUT_KEY = 'perps.tv.chart.layout';
export const CHART_STUDY_KEY = 'perps.tv.chart.study';

export const saveChartLayout = (tvWidget: any) => {
    setTimeout(() => {
        tvWidget.save((state: object) => {
            saveToLocalStorage(CHART_LAYOUT_KEY, state);
        });
    }, 100);
};
export const loadChartDrawState = (tvWidget: any) => {
    const savedState = loadFromLocalStorage(CHART_LAYOUT_KEY);
    if (savedState) {
        tvWidget.load(savedState);
    }
};
