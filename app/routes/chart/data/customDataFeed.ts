import type {
    HistoryCallback,
    IDatafeedChartApi,
    LibrarySymbolInfo,
    Mark,
    ResolutionString,
    SubscribeBarsCallback,
} from '~/tv/charting_library/charting_library';
import { getHistoricalData, getMarkFillData } from './candleDataCache';
import { mapResolutionToInterval } from '../utils';
import { useWsObserver } from '~/hooks/useWsObserver';
import { processWSCandleMessage } from './processChartData';

export const createDataFeed = (
    subscribe: (channel: string, payload: any) => void,
): IDatafeedChartApi =>
    ({
        searchSymbols: (userInput: string, exchange, symbolType, onResult) => {
            onResult([
                {
                    symbol: userInput,
                    description: 'Sample Symbol',
                    exchange: exchange,
                    type: symbolType,
                },
            ]);
        },

        onReady: (cb: any) => {
            cb({
                supported_resolutions: ['1m', '5m', '15m', '1h', '1d'],
                supports_marks: true,
            }),
                //   exchanges: [
                //     { value: "BINANCE", name: "Binance", desc: "Binance Exchange" },
                //     { value: "NASDAQ", name: "NASDAQ", desc: "NASDAQ Exchange" },
                // ],
                // supports_marks: false,
                // supports_time: true,

                0;
        },

        resolveSymbol: (symbolName, onResolve, onError) => {
            const symbolInfo: LibrarySymbolInfo = {
                ticker: symbolName,
                name: symbolName,
                minmov: 1,
                pricescale: 1,
                timezone: 'Etc/UTC',
                session: '24x7',
                has_intraday: true,
                supported_resolutions: [
                    '1',
                    '5',
                    '15',
                    '30',
                    '60',
                    'D',
                ] as ResolutionString[],
                description: '',
                type: '',
                exchange: '',
                listed_exchange: '',
                format: 'price',
            };
            onResolve(symbolInfo);
        },

        getBars: async (
            symbolInfo,
            resolution,
            periodParams,
            onResult,
            onError,
        ) => {
            /**
             * for fetching historical data
             */
            const { from, to } = periodParams;
            const symbol = symbolInfo.ticker;

            if (symbol) {
                try {
                    const bars = await getHistoricalData(
                        symbol,
                        resolution,
                        from,
                        to,
                    );

                    bars && onResult(bars, { noData: bars.length === 0 });
                } catch (error) {
                    console.error('Error loading historical data:', error);
                }
            }
        },

        getMarks: async (symbolInfo, from, to, onDataCallback, resolution) => {
            const orderHistoryMarks: Map<string, Mark> = new Map();

            const fillMarks = (payload: any, isLive: boolean) => {
                if (payload.length > 0) {
                    payload.forEach((element: any, index: number) => {
                        const isBuy = element.side === 'B';

                        const markerColor = isBuy ? '#26a69a' : '#ef5350';

                        orderHistoryMarks.set(element.cloid, {
                            id: index,
                            time: element.time / 1000,
                            color: {
                                border: markerColor,
                                background: markerColor,
                            },
                            text: element.dir + ' at ' + element.px,
                            label: isBuy ? 'B' : 'S',
                            labelFontColor: 'white',
                            minSize: 15,
                            borderWidth: 0,
                            hoveredBorderWidth: 1,
                        });
                    });
                }

                return orderHistoryMarks;
            };

            try {
                const fillHistory = await getMarkFillData(
                    '0x023a3d058020fb76cca98f01b3c48c8938a22355',
                    symbolInfo.name,
                );

                fillMarks(fillHistory, false);

                const markArray = [...orderHistoryMarks.values()];

                if (markArray.length > 0) {
                    onDataCallback(markArray);
                }

                subscribe('userFills', {
                    payload: {
                        user: '0x023a3d058020fb76cca98f01b3c48c8938a22355',
                    },
                    handler: (payload: any) => {
                        // console.log(payload.fills[0].coin)
                        if (symbolInfo.name === payload.fills[0].coin) {
                            fillMarks(payload, true);

                            const markArray = [...orderHistoryMarks.values()];

                            // console.log(markArray)

                            if (markArray.length > 0) {
                                onDataCallback(markArray);
                            }
                        }
                    },
                });
            } catch (error) {
                console.error('Error fetching marks:', error);
            }
        },

        subscribeBars: (symbolInfo, resolution, onTick) => {
            subscribe('candle', {
                payload: {
                    coin: symbolInfo.ticker,
                    interval: mapResolutionToInterval(resolution),
                },
                handler: (payload: any) => {
                    if (payload.s === symbolInfo.ticker) {
                        onTick(processWSCandleMessage(payload));
                    }
                },
                single: true,
            });
            // subscribeOnStream(symbolInfo, resolution, onTick);
        },

        unsubscribeBars: (listenerGuid) => {
            clearInterval((window as any)[listenerGuid]);
            delete (window as any)[listenerGuid];
        },
    } as IDatafeedChartApi);
