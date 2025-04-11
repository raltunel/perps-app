import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import type { LineData } from './component/LineComponent';
import { buyColor, sellColor } from './customOrderLineUtils';
import LineComponent from './component/LineComponent';

const PnlOrderLine = () => {
    const { chart } = useTradingView();
    const { positions, symbol } = useTradeDataStore();

    const [lines, setLines] = useState<LineData[]>([]);

    const filteredPositions = useMemo(() => {
        const data = positions
            .filter((i) => i.coin === symbol)
            .map((i) => {
                return {
                    price: i.entryPx,
                    pnl: Number(i.unrealizedPnl.toFixed(2)),
                    szi: i.szi,
                    liqPrice: i.liquidationPx,
                };
            });

        return data;
    }, [JSON.stringify(positions), symbol]);

    useEffect(() => {
        if (!chart || !positions?.length) {
            setLines([]);
            return;
        }

        const newLines: LineData[] = filteredPositions.flatMap((order) => {
            const pnl = Number(order.pnl.toFixed(2));
            const orderText: string =
                '  PNL ' + (pnl > 0 ? '$' + pnl : '-$' + Math.abs(pnl));

            const pnlLine: LineData = {
                xLoc: 0.1,
                yLoc: order.price,
                text: orderText,
                quantityText: order.szi.toFixed(5),
                color: pnl > 0 ? buyColor : sellColor,
            };

            const liqLine: LineData = {
                xLoc: 0.2,
                yLoc: order.liqPrice,
                text: '  Liq. Price',
                quantityText: undefined,
                color: sellColor,
            };

            return [pnlLine, liqLine];
        });
        console.log('PNLL', { newLines });

        setLines(newLines);
    }, [JSON.stringify(filteredPositions), symbol]);

    if (!chart) return null;

    return <LineComponent key='pnl' lines={lines} />;
};

export default PnlOrderLine;
