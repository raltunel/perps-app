import { useChartStore } from '~/stores/TradingviewChartStore';

export const saveChartLayout = (tvWidget: any) => {
    setTimeout(() => {
        try {
            tvWidget.save((state: object) => {
                useChartStore.getState().saveLayout(state);
            });
        } catch (error) {}
    }, 100);
};
export const loadChartDrawState = (tvWidget: any) => {
    const savedState = useChartStore.getState().loadLayout();
    if (savedState) {
        tvWidget.load(savedState);
    }
};
