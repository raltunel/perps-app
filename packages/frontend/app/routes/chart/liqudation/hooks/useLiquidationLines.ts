import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HorizontalLineData } from '../LiqudationLines';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useLiquidationStore } from '~/stores/LiquidationStore';
import type { LiqLevel } from '~/routes/trade/liquidationsChart/LiquidationUtils';
import {
    useLiqChartStore,
    type LiqThresholdLevel,
} from '~/stores/LiqChartStore';

// Slot height in pixels for chart liq lines
const SLOT_HEIGHT_PX = 4;

interface SlottedLiq {
    px: number;
    sz: number;
    avgSz: number;
    type: 'buy' | 'sell';
    ratio: number;
}

export const useLiqudationLines = (scaleData: any): HorizontalLineData[] => {
    const { symbolInfo } = useTradeDataStore();
    const { buyLiqs, sellLiqs } = useLiquidationStore();

    const markPxRef = useRef(symbolInfo?.markPx);
    markPxRef.current = symbolInfo?.markPx;
    const [lines, setLines] = useState<HorizontalLineData[]>([]);
    const { liqLevels } = useLiqChartStore();

    // Get chart boundaries from scaleData
    const chartBounds = useMemo(() => {
        if (!scaleData?.yScale) return null;
        const domain = scaleData.yScale.domain();
        return {
            minPx: Math.min(domain[0], domain[1]),
            maxPx: Math.max(domain[0], domain[1]),
        };
    }, [scaleData?.yScale?.domain()?.join(',')]);

    // Calculate price range per slot based on pixel height
    const pricePerSlot = useMemo(() => {
        if (!scaleData?.yScale || !chartBounds) return 0;
        const range = scaleData.yScale.range();
        const totalPixels = Math.abs(range[1] - range[0]);
        const totalPrice = chartBounds.maxPx - chartBounds.minPx;
        if (totalPixels === 0) return 0;
        return (totalPrice / totalPixels) * SLOT_HEIGHT_PX;
    }, [scaleData?.yScale, chartBounds]);

    // Find max sz across all liq levels (both buy and sell sides)
    const maxLiqSz = useMemo(() => {
        const allLiqs = [...buyLiqs, ...sellLiqs];
        if (allLiqs.length === 0) return 0;
        return Math.max(...allLiqs.map((liq) => liq.sz));
    }, [buyLiqs, sellLiqs]);

    // Filter liqs within chart bounds
    const filteredBuyLiqs = useMemo(() => {
        if (!chartBounds) return [];
        return buyLiqs.filter(
            (liq) => liq.px >= chartBounds.minPx && liq.px <= chartBounds.maxPx,
        );
    }, [buyLiqs, chartBounds]);

    const filteredSellLiqs = useMemo(() => {
        if (!chartBounds) return [];
        return sellLiqs.filter(
            (liq) => liq.px >= chartBounds.minPx && liq.px <= chartBounds.maxPx,
        );
    }, [sellLiqs, chartBounds]);

    // Generate slots based on chart bounds and slot height
    const generateSlots = useCallback(
        (type: 'buy' | 'sell'): { px: number; nextPx: number }[] => {
            if (!chartBounds || pricePerSlot <= 0) return [];

            const slots: { px: number; nextPx: number }[] = [];
            const markPx = markPxRef.current ?? 0;

            if (type === 'buy') {
                // Buy slots: from markPx down to minPx
                let currentPx = markPx;
                while (currentPx > chartBounds.minPx) {
                    const nextPx = currentPx - pricePerSlot;
                    slots.push({
                        px: currentPx,
                        nextPx: Math.max(nextPx, chartBounds.minPx),
                    });
                    currentPx = nextPx;
                }
            } else {
                // Sell slots: from markPx up to maxPx
                let currentPx = markPx;
                while (currentPx < chartBounds.maxPx) {
                    const nextPx = currentPx + pricePerSlot;
                    slots.push({
                        px: currentPx,
                        nextPx: Math.min(nextPx, chartBounds.maxPx),
                    });
                    currentPx = nextPx;
                }
            }

            return slots;
        },
        [chartBounds, pricePerSlot],
    );

    // Slot buy liqs
    const slottedBuyLiqs = useMemo((): SlottedLiq[] => {
        const slots = generateSlots('buy');
        if (slots.length === 0) return [];

        return slots
            .map((slot) => {
                const matchingLiqs = filteredBuyLiqs.filter(
                    (liq) => liq.px <= slot.px && liq.px > slot.nextPx,
                );
                const summedSz = matchingLiqs.reduce(
                    (acc, liq) => acc + liq.sz,
                    0,
                );
                const count = matchingLiqs.length;
                const avgSz = count > 0 ? summedSz / count : 0;
                const ratio = maxLiqSz > 0 ? avgSz / maxLiqSz : 0;

                return {
                    px: (slot.px + slot.nextPx) / 2, // center of slot
                    sz: summedSz,
                    avgSz,
                    type: 'buy' as const,
                    ratio,
                };
            })
            .filter((slot) => slot.sz > 0);
    }, [generateSlots, filteredBuyLiqs, maxLiqSz]);

    // Slot sell liqs
    const slottedSellLiqs = useMemo((): SlottedLiq[] => {
        const slots = generateSlots('sell');
        if (slots.length === 0) return [];

        return slots
            .map((slot) => {
                const matchingLiqs = filteredSellLiqs.filter(
                    (liq) => liq.px >= slot.px && liq.px < slot.nextPx,
                );
                const summedSz = matchingLiqs.reduce(
                    (acc, liq) => acc + liq.sz,
                    0,
                );
                const count = matchingLiqs.length;
                const avgSz = count > 0 ? summedSz / count : 0;
                const ratio = maxLiqSz > 0 ? avgSz / maxLiqSz : 0;

                return {
                    px: (slot.px + slot.nextPx) / 2, // center of slot
                    sz: summedSz,
                    avgSz,
                    type: 'sell' as const,
                    ratio,
                };
            })
            .filter((slot) => slot.sz > 0);
    }, [generateSlots, filteredSellLiqs, maxLiqSz]);

    const getColor = useCallback(
        (ratio: number) => {
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

    const generateHorizontalLine = useCallback(
        (slottedLiq: SlottedLiq): HorizontalLineData => {
            const ratioPercent = slottedLiq.ratio * 100;
            return {
                yPrice: slottedLiq.px,
                liqValue: slottedLiq.sz,
                color: getColor(ratioPercent),
                strokeStyle: getColor(ratioPercent),
                lineWidth: SLOT_HEIGHT_PX,
                type: slottedLiq.type === 'sell' ? 'Short' : 'Long',
                dash: undefined,
                globalAlpha: 0.4,
            } as HorizontalLineData;
        },
        [getColor],
    );

    useEffect(() => {
        if (slottedBuyLiqs.length === 0 && slottedSellLiqs.length === 0) {
            setLines([]);
            return;
        }

        const newLines: HorizontalLineData[] = [];

        slottedBuyLiqs.forEach((liq) => {
            newLines.push(generateHorizontalLine(liq));
        });

        slottedSellLiqs.forEach((liq) => {
            newLines.push(generateHorizontalLine(liq));
        });

        setLines(newLines);
    }, [slottedBuyLiqs, slottedSellLiqs, generateHorizontalLine]);

    return lines;
};
