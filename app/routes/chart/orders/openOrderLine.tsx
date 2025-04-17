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

        const data = {
            coin: 'BTC',
            cloid: '',
            oid: 85589596198,
            side: 'sell',
            sz: 0.5555,
            tif: 'null',
            timestamp: 1744293262831,
            status: 'open',
            limitPx: 64339,
            origSz: 0,
            reduceOnly: true,
            isPositionTpsl: true,
            isTrigger: true,
            triggerPx: 69934,
            triggerCondition: 'Price below 69934',
            orderType: 'Stop Limit',
            orderValue: 0,
        };
        const newLines: LineData[] = [...userSymbolOrders, data]
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
                const tempTriggerCondition =
                    triggerCondition && triggerCondition !== 'N/A'
                        ? triggerCondition
                        : '';

                let yPrice = limitPx;
                let quantityTextValue = sz;
                let label: LineLabel = {
                    type: 'Limit',
                    price: limitPx,
                    triggerCondition: tempTriggerCondition,
                };
                const type = 'LIMIT';

                if (orderType === 'Limit') {
                    label = {
                        type: 'Limit',
                        price: limitPx,
                        triggerCondition: tempTriggerCondition,
                    };
                } else if (orderType) {
                    label = {
                        type: orderType as
                            | 'Take Profit Market'
                            | 'Stop Market'
                            | 'Stop Limit',
                        triggerCondition: tempTriggerCondition,
                        orderType,
                    };

                    if (triggerPx) {
                        yPrice = triggerPx;
                    }
                    quantityTextValue = sz ? sz : pnlSzi;

                    console.log({ sz, pnlSzi });
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
