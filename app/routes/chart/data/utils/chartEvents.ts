import { saveChartLayout } from './chartStorage';

export const drawingEvent = (chart: any) => {
    chart?.subscribe('drawing_event', (id: any, type: any) => {
        saveChartLayout(chart);
    });
};

export const drawingEventUnsubscribe = (chart: any) => {
    chart?.unsubscribe('drawing_event', () => {});
};

export const studyEvents = (chart: any) => {
    chart?.subscribe('study_event', (id: any, type: any) => {
        saveChartLayout(chart);
    });

    chart?.subscribe('study_properties_changed', () => {
        saveChartLayout(chart);
    });
};

export const studyEventsUnsubscribe = (chart: any) => {
    chart?.unsubscribe('study_event', () => {});
    chart?.unsubscribe('study_properties_changed', () => {});
};



