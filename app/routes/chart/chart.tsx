import { useEffect, useRef, useState } from "react";
import {
  widget,
  type IDatafeedChartApi,
  type ResolutionString,
} from "../../../public/tradingview/charting_library";
import { createDataFeed } from "./data/customDataFeed";
import { useWebSocketContext } from "~/contexts/WebSocketContext";
export interface ChartContainerProps {
  symbolName: string;
  interval: ResolutionString;
  libraryPath: string;
  chartsStorageUrl: string;
  chartsStorageApiVersion: string;
  clientId: string;
  userId: string;
  fullscreen: boolean;
  autosize: boolean;
  studiesOverrides: any;
  container: string;
}

const TradingViewChart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const defaultProps: Omit<ChartContainerProps, "container"> = {
    symbolName: "BTC",
    interval: "D" as ResolutionString,
    libraryPath: "/tradingview/charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const tvWidget = new widget({
      container: chartContainerRef.current,
      library_path: defaultProps.libraryPath,
      timezone: "Etc/UTC",
      symbol: defaultProps.symbolName,
      fullscreen: false,
      autosize: true,
      datafeed: createDataFeed() as any,
      interval: defaultProps.interval,
      locale: "en",
      theme: "dark",
      // overrides: {
      //   "paneProperties.background": "#0e0e14",
      //   "paneProperties.backgroundType": "solid",
      // },
      custom_css_url: "./../tradingview-chart-custom.css",
      loading_screen: { backgroundColor: "#0e0e14" },
      // load_last_chart:false,
      time_frames: [
        { text: "1m", resolution: "1" as ResolutionString},   
        { text: "5m", resolution: "5" as ResolutionString},   
        { text: "15m", resolution: "15" as ResolutionString}, 
        { text: "1H", resolution: "60" as ResolutionString},  
        { text: "4H", resolution: "240" as ResolutionString}, 
        { text: "1D", resolution: "1D" as ResolutionString },  

    ],
    });

    /**
     * for change domain
     */
/*     if (tvWidget) {

      tvWidget.onChartReady(() => {

        tvWidget.chart().setTimeFrame({val: {type: 'period-back' as any, value: '12M'}, res: '1d' as any});

        tvWidget.chart().setVisibleRange({
            from: Date.now() / 1000 - 3600 * 100, 
            to: Date.now() / 1000, 
        });
    });
    
    } */

    return () => {
      if (tvWidget) {
        tvWidget.remove();
      }
    };
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ position: "relative", width: "100%", height: "400px" }}
    />
  );
};

export default TradingViewChart;
