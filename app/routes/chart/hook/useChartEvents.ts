import { useEffect } from 'react';
import { saveChartDrawState } from '../data/utils/chartStorage';

export const useChartEvents = (chart: any) => {
    useEffect(() => {
        if (!chart) return;

        chart.subscribe('drawing_event', (id: any, type: any) => {
            saveChartDrawState(chart);
        });

        return () => {
            chart.unsubscribe('drawing_event');
        };
    }, [chart]);
};
