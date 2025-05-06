import { useChartStore } from '~/stores/TradingviewChartStore';

export const saveChartLayout = (tvWidget: any) => {
    setTimeout(() => {
        try {
            tvWidget.save((state: object) => {
                const chartState = {
                    chartLayout: state,
                    interval: tvWidget.activeChart().resolution(),
                };

                useChartStore.getState().saveLayout(chartState);
            });
        } catch (error) {
            console.error(error);
        }
    }, 100);
};

export const getChartLayout = () => {
    const savedState = useChartStore.getState().loadLayout();

    return savedState;
};
