import type {
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
} from "public/tradingview/charting_library/charting_library";
import { getHistoricalData } from "./candleDataCache";
import { mapResolutionToInterval } from "../utils";


export const createDataFeed = (priceData: any[]): IDatafeedChartApi =>
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
        try {
          const period = mapResolutionToInterval(resolution);          
          const bars = await getHistoricalData(
            symbol,
            period,
            from,
            to,
          );

          bars && onResult(bars, { noData: bars.length === 0 });
        } catch (error) {
          console.error("Error loading historical data:", error);
        }
      }
 
    },

    subscribeBars: (
      symbolInfo,
      resolution,
      onTick,
      listenerGuid,
      onResetCacheNeededCallback
    ) => {
      /**
       * for live candles
       */
    },

    unsubscribeBars: (listenerGuid) => {
      clearInterval((window as any)[listenerGuid]);
      delete (window as any)[listenerGuid];
    },
  } as IDatafeedChartApi);
