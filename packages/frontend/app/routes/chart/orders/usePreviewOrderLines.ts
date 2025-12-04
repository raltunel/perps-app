import { useEffect, useState } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { LineData } from './component/LineComponent';
import { quantityTextFormatWithComma } from './customOrderLineUtils';
import { useChartLinesStore } from '~/stores/ChartLinesStore';

export const usePreviewOrderLines = (): {
    previewLines: LineData[];
    updateYPosition: (yPrice: number) => void;
} => {
    const { orderInputPriceValue, isPreviewOrderHovered } = useTradeDataStore();
    const { previewLines, setPreviewLines } = useChartLinesStore();

    const updateYPosition = (yPrice: number) => {
        setPreviewLines([
            {
                xLoc: 0.4,
                yPrice: yPrice,
                color: isPreviewOrderHovered ? '#d4cc45' : '#e9e980',
                type: 'PREVIEW_ORDER',
                lineStyle: 2,
                lineWidth: 1,
            },
        ]);
    };

    useEffect(() => {
        if (!orderInputPriceValue.value) {
            setPreviewLines([]);
            return;
        } else {
            setPreviewLines([
                {
                    xLoc: 0.4,
                    yPrice: orderInputPriceValue.value,
                    color: isPreviewOrderHovered ? '#d4cc45' : '#e9e980',
                    type: 'PREVIEW_ORDER',
                    lineStyle: 2,
                    lineWidth: 1,
                },
            ]);
        }
    }, [orderInputPriceValue.value, isPreviewOrderHovered]);

    return { previewLines, updateYPosition };
};
