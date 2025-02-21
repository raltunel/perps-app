import type {
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from "public/tradingview/charting_library/charting_library";
import { fetchCandleSeriesCroc } from "./fetchCandleData";
import { useWebSocketContext } from "~/contexts/WebSocketContext";

// Sembol bazlı önbellek (cache)
const priceDataCache: Record<string, any[]> = {};

export const createDataFeed = (
  priceData: any[],
  socketRef: WebSocket | null
): IDatafeedChartApi =>
  ({
    searchSymbols: (userInput: string, exchange, symbolType, onResult) => {
      onResult([
        {
          symbol: userInput,
          description: "Sample Symbol",
          exchange: exchange,
          type: symbolType,
        },
      ]);
    },

    onReady: (cb: any) =>
      setTimeout(() => cb({ supported_resolutions: ["1D"] }), 0),

    resolveSymbol: (symbolName, onResolve, onError) => {
      const symbolInfo: LibrarySymbolInfo = {
        ticker: symbolName,
        name: symbolName,
        minmov: 1,
        pricescale: 100,
        timezone: "Etc/UTC",
        session: "24x7",
        has_intraday: true,
        supported_resolutions: [
          "1",
          "5",
          "15",
          "30",
          "60",
          "D",
        ] as ResolutionString[],
        description: "",
        type: "",
        exchange: "",
        listed_exchange: "",
        format: "volume",
      };
      onResolve(symbolInfo);
    },

    getBars: async (
      symbolInfo,
      resolution,
      periodParams,
      onResult,
      onError
    ) => {
      /**
       * for fetching historical data
       */
      const { from, to } = periodParams;

      const symbol = symbolInfo.ticker;

      if (symbol) {
        const chainId = "0x1";
        const poolIndex = 420;
        const period = 86400;
        const baseTokenAddress = "0x0000000000000000000000000000000000000000";
        const quoteTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        const nCandles = Math.floor((to - from) / period);
        const endTime = to;

        const response = fetchCandleSeriesCroc(
          chainId,
          poolIndex,
          period,
          baseTokenAddress,
          quoteTokenAddress,
          endTime,
          nCandles
        );

        response.then((candles) => {
          priceDataCache[symbol] = candles.map((item: any) => ({
            time: item.time * 1000,
            open: item.priceOpen,
            high: item.maxPrice,
            low: item.minPrice,
            close: item.priceClose,
            volume: item.volumeBase,
          }));

          const bars = priceDataCache[symbol]?.filter(
            (i) => i.time >= from * 1000 && i.time <= to * 1000
          );
          if (bars) {
            onResult(bars, { noData: false });
          }
        });
      }
      // const chainId = "0x1";
      // const poolIndex = 420;
      // const period = 86400;
      // const baseTokenAddress = "0x0000000000000000000000000000000000000000";
      // const quoteTokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      // const nCandles = Math.floor((to - from) / period);
      // const endTime = to;

      // const response = fetchCandleSeriesCroc(
      //   chainId,
      //   poolIndex,
      //   period,
      //   baseTokenAddress,
      //   quoteTokenAddress,
      //   endTime,
      //   nCandles
      // );

      // response.then((candles) => {
      //   priceData.unshift(
      //     ...candles.map((item: any) => ({
      //       time: item.time * 1000,
      //       open: item.priceOpen,
      //       high: item.maxPrice,
      //       low: item.minPrice,
      //       close: item.priceClose,
      //       volume: item.volumeBase,
      //     }))
      //   );

      //   const bars = priceData.filter(
      //     (i: any) => i.time > from * 1000 && i.time < to * 1000
      //   );

      //   if (priceData.length > 0) {
      //     console.log("barsssss");

      //     onResult(bars, { noData: false });
      //   } else {
      //     onResult([], { noData: true });
      //   }
      // });
    },

    subscribeBars: (
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback
    ) => {
      subscribeOnStream(symbolInfo, resolution, onTick, socketRef);
    },

    unsubscribeBars: (listenerGuid) => {
      clearInterval((window as any)[listenerGuid]);
      delete (window as any)[listenerGuid];
    },
  } as IDatafeedChartApi);

const subscribeOnStream = (
  symbolInfo: LibrarySymbolInfo,
  resolution: ResolutionString,
  onTick: SubscribeBarsCallback,
  socketRef: WebSocket | null
) => {

  if (socketRef) {
    socketRef.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.channel === "candle") {

        const bar = {
          time: msg.data.T,
          open: Number(msg.data.o),
          high: Number(msg.data.h),
          low: Number(msg.data.l),
          close: Number(msg.data.c),
          volume: Number(msg.data.v),
        }

        onTick(bar);
      }
    };
  }
};
