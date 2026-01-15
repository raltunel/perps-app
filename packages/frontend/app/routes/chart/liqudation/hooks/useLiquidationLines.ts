import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HorizontalLineData } from '../LiqudationLines';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import type { OrderBookLiqIF } from '~/utils/orderbook/OrderBookIFs';
import {
    useLiqChartStore,
    type LiqThresholdLevel,
} from '~/stores/LiqChartStore';

export const useLiqudationLines = (scaleData: any): HorizontalLineData[] => {
    const { symbolInfo } = useTradeDataStore();

    const { hrLiqBuys, hrLiqSells } = useOrderBookStore();

    const markPxRef = useRef(symbolInfo?.markPx);
    markPxRef.current = symbolInfo?.markPx;
    const [lines, setLines] = useState<HorizontalLineData[]>([]);
    const liqLevelDiffRef = useRef(0);
    const { liqLevels } = useLiqChartStore();

    const getColor = useCallback(
        (ratio: number) => {
            // if (ratio >= 80) return '#FDE725';
            // if (ratio > 70) return '#2BAE7D';
            // if (ratio > 50) return '#287D8D';
            // return '#461668';

            let foundLevel;
            liqLevels.forEach((level) => {
                if (
                    ratio >= (level.minRatio ?? 0) &&
                    ratio < (level.maxRatio ?? 100)
                ) {
                    foundLevel = level;
                    return;
                }
            });

            return foundLevel
                ? (foundLevel as LiqThresholdLevel).color
                : '#461668';
        },
        [liqLevels],
    );

    const calculatLineWidth = useCallback((): number => {
        if (scaleData) {
            const mid =
                (scaleData.yScale.domain()[0] + scaleData.yScale.domain()[1]) /
                2;
            const l1 = scaleData.yScale(mid);
            const l2 = scaleData.yScale(mid + liqLevelDiffRef.current);
            return Math.abs(l2 - l1);
        }

        return 0;
    }, [JSON.stringify(scaleData?.yScale.domain())]);

    const generateHorizontalLine = useCallback(
        (obLiqData: OrderBookLiqIF, maxSz: number): HorizontalLineData => {
            return {
                yPrice: obLiqData.px,
                liqValue: obLiqData.sz,
                color: getColor((obLiqData.sz / maxSz) * 100),
                strokeStyle: getColor((obLiqData.sz / maxSz) * 100),
                lineWidth: calculatLineWidth(),
                type:
                    obLiqData.px > (markPxRef.current ?? 0) ? 'Short' : 'Long',
                dash: undefined,
                globalAlpha: 0.4,
            } as HorizontalLineData;
        },
        [calculatLineWidth],
    );

    useEffect(() => {
        if (hrLiqBuys.length === 0 && hrLiqSells.length === 0) return;

        liqLevelDiffRef.current = Math.abs(hrLiqBuys[1].px - hrLiqBuys[0].px);
        const newLines: HorizontalLineData[] = [];

        let maxSz = 0;

        hrLiqBuys.forEach((liq) => {
            if (liq.sz > maxSz) {
                maxSz = liq.sz;
            }
        });

        hrLiqSells.forEach((liq) => {
            if (liq.sz > maxSz) {
                maxSz = liq.sz;
            }
        });

        hrLiqBuys.forEach((liq) => {
            newLines.push(generateHorizontalLine(liq, maxSz));
        });

        hrLiqSells.forEach((liq) => {
            newLines.push(generateHorizontalLine(liq, maxSz));
        });

        setLines(newLines);
    }, [hrLiqBuys, hrLiqSells]);
    return lines;
};
