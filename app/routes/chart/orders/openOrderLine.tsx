import { useEffect, useMemo, useState } from 'react';
import { useTradingView } from '~/contexts/TradingviewContext';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { useDebugStore } from '~/stores/DebugStore';
import type { LineData } from './component/LineComponent';
import { buyColor, sellColor, type LineLabel } from './customOrderLineUtils';
import LineComponent from './component/LineComponent';

const OpenOrderLine = () => {
    const { chart } = useTradingView();
    const { userSymbolOrders, positions, symbol } = useTradeDataStore();
    const { debugWallet } = useDebugStore();

    const [lines, setLines] = useState<LineData[]>([]);

    const pnlSzi = useMemo(() => {
        const data = positions
            .filter((i) => i.coin === symbol)
            .map((i) => {
                return {
                    price: i.entryPx,
                    pnl: i.unrealizedPnl,
                    szi: i.szi,
                    liqPrice: i.liquidationPx,
                };
            });

        if (data.length > 0) {
            return data[0].szi;
        } else {
            return undefined;
        }
    }, [JSON.stringify(positions), symbol]);

    useEffect(() => {
        if (!chart || !userSymbolOrders?.length || !pnlSzi) {
            setLines([]);
            return;
        }
        const newLines: LineData[] = userSymbolOrders
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((order): LineData => {
                const {
                    sz,
                    side,
                    orderType,
                    limitPx,
                    triggerPx,
                    triggerCondition,
                } = order;

                const color = side === 'buy' ? buyColor : sellColor;
                const xLoc = 0.4;
                const tempTriggerCondition = triggerCondition ?? '';

                let yPrice = limitPx;
                let quantityTextValue = sz;
                let label: LineLabel = {
                    type: 'LIMIT',
                    price: limitPx,
                    triggerCondition: tempTriggerCondition,
                };
                let type: LineData['type'] = 'LIMIT';

                if (orderType === 'Limit') {
                    label = {
                        type: 'LIMIT',
                        price: limitPx,
                        triggerCondition: tempTriggerCondition,
                    };
                    type = 'LIMIT';
                } else if (orderType) {
                    label = {
                        type: 'TP_SL',
                        triggerCondition: tempTriggerCondition,
                        orderType,
                    };
                    type = 'TP_SL';

                    if (triggerPx) {
                        yPrice = triggerPx;
                    }

                    quantityTextValue = pnlSzi;
                }

                return {
                    xLoc,
                    yPrice,
                    textValue: label,
                    quantityTextValue,
                    color,
                    type,
                };
            });

        setLines(newLines);
    }, [
        chart,
        JSON.stringify(userSymbolOrders),
        debugWallet,
        symbol,
        JSON.stringify(pnlSzi),
    ]);

    if (!chart) return null;

    return <LineComponent key='limit' lines={lines} />;
};

export default OpenOrderLine;
