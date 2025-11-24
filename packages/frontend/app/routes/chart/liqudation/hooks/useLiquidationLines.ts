import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HorizontalLineData } from '../LiqudationLines';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useOrderBookStore } from '~/stores/OrderBookStore';
import type { OrderBookLiqIF } from '~/utils/orderbook/OrderBookIFs';

export const useLiqudationLines = (scaleData: any): HorizontalLineData[] => {
    const { symbolInfo } = useTradeDataStore();

    const { hrLiqBuys, hrLiqSells } = useOrderBookStore();

    const markPx = symbolInfo?.markPx;
    const markPxRef = useRef(symbolInfo?.markPx);
    markPxRef.current = symbolInfo?.markPx;
    const [lines, setLines] = useState<HorizontalLineData[]>([]);
    const liqLevelDiffRef = useRef(0);

    const getLineWidth = (ratio: number) => {
        // if (ratio >= 1) return 8;
        // if (ratio > 0.05) return 4;
        // if (ratio > 0.01) return 3;
        return 8;
    };

    const getColor = (ratio: number) => {
        if (ratio >= 80) return '#FDE725';
        if (ratio > 70) return '#2BAE7D';
        if (ratio > 50) return '#287D8D';
        return '#461668';
    };

    // const getDash = (ratio: number) => (ratio >= 80 ? undefined : [1, 2]);

    function simulateData(markyPrice: number, n = 5000) {
        const min = markyPrice * 0.1;
        const max = markyPrice * 2;
        return Array.from({ length: n }, () => {
            const yPrice = min + Math.random() * (max - min);
            return {
                yPrice: Number(yPrice.toFixed(6)),
                value: Math.random() * 100,
            };
        });
    }

    const liqData = useMemo(() => {
        if (markPx) {
            const data = simulateData(markPx);

            return data;
        }
        return [];
    }, [markPx === undefined]);

    function getBinSize(min: number, max: number, targetRows = 100) {
        const range = max - min;
        return range / targetRows;
    }
    function binData(
        data: { yPrice: number; value: number }[],
        binSize: number,
        min: number,
    ): HorizontalLineData[] {
        if (markPx) {
            const bins: Record<string, { yPrice: number; values: number[] }> =
                {};

            data.forEach((d) => {
                const binIndex = Math.floor((d.yPrice - min) / binSize);
                const binKey = (min + binIndex * binSize).toFixed(6);
                if (!bins[binKey])
                    bins[binKey] = { yPrice: parseFloat(binKey), values: [] };
                bins[binKey].values.push(d.value);
            });

            return Object.values(bins).map((b) => {
                const avgValue =
                    b.values.reduce((a, c) => a + c, 0) / b.values.length;
                const dash = undefined;
                const color = getColor(avgValue);
                const lineWidth = 8;

                return {
                    yPrice: b.yPrice,
                    liqValue: avgValue,
                    color: color,
                    strokeStyle: color,
                    lineWidth,
                    type: b.yPrice > markPx ? 'Short' : 'Long',
                    dash,
                    globalAlpha: 0.4,
                };
            });
        }
        return [];
    }

    // useEffect(() => {
    //     if (scaleData) {
    //         const dom = scaleData.yScale.domain();
    //         const minDom = dom[0];
    //         const maxDom = dom[1];
    //         const binSize = getBinSize(minDom, maxDom, 100);
    //         if (markPx) {
    //             const filteredData = liqData.filter(
    //                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //                 (d: any) => d.yPrice >= minDom && d.yPrice <= maxDom,
    //             );
    //             const res = binData(filteredData, binSize, minDom);

    //             setLines(res);
    //         }
    //     }
    // }, [JSON.stringify(scaleData?.yScale.domain()), liqData]);

    const calculatLineWidth = useCallback((): number => {
        if (scaleData) {
            const l1 = scaleData.yScale(80000);
            const l2 = scaleData.yScale(90000);
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
                lineWidth: calculatLineWidth() / 8,
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
