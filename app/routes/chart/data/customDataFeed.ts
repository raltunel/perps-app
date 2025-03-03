import type {
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from "~/tv/charting_library/charting_library";
import { getHistoricalData } from "./candleDataCache";
import { mapResolutionToInterval } from "../utils";
import { useWsObserver } from "~/hooks/useWsObserver";
import { processWSCandleMessage } from "./processChartData";

export const createDataFeed = (subscribe: (channel: string, payload: any) => void): IDatafeedChartApi =>
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

    onReady: (cb: any) => {
      cb({ supported_resolutions: ["1m","5m","15m","1h","1d"] }),
      
    //   exchanges: [
    //     { value: "BINANCE", name: "Binance", desc: "Binance Exchange" },
    //     { value: "NASDAQ", name: "NASDAQ", desc: "NASDAQ Exchange" },
    // ],
    // supports_marks: false, 
    // supports_time: true, 
      
      0
    },

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
          const bars = await getHistoricalData(
            symbol,
            resolution,
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
    ) => {
      console.log('>>>subscribeBars', symbolInfo, resolution);
      subscribe(
        'candle',
        {
          payload: {
            coin: symbolInfo.ticker,
            interval: mapResolutionToInterval(resolution),
          },
          handler: (payload: any) => {
            if(payload.s === symbolInfo.ticker){
              onTick(processWSCandleMessage(payload));
            }
          },
          single: true
        }
      )
      // subscribeOnStream(symbolInfo, resolution, onTick);
    },

    unsubscribeBars: (listenerGuid) => {
      clearInterval((window as any)[listenerGuid]);
      delete (window as any)[listenerGuid];
    },
  } as IDatafeedChartApi);

