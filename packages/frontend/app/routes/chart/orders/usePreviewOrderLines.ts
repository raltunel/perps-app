import { useEffect, useState } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { LineData } from './component/LineComponent';
import { quantityTextFormatWithComma } from './customOrderLineUtils';

export const usePreviewOrderLines = (): LineData[] => {
    const { orderInputPriceValue } = useTradeDataStore();

    const [lines, setLines] = useState<LineData[]>([]);

    useEffect(() => {
        if (!orderInputPriceValue) {
            setLines([]);
            return;
        } else {
            setLines([
                {
                    xLoc: 0.4,
                    yPrice: orderInputPriceValue,
                    color: '#e9e980',
                    type: 'PREVIEW_ORDER',
                    lineStyle: 2,
                    lineWidth: 1,
                },
            ]);
        }
    }, [orderInputPriceValue]);

    return lines;
};
