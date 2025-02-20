import { fetchCandles } from "./fetchCandleData";

const dataCache = new Map<string, any[]>();

export async function getHistoricalData(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
) {
  const key = `${symbol}-${resolution}`;

  let cachedData = dataCache.get(key) || [];
  const hasDataForRange = cachedData.some(
    (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
  );

  if (hasDataForRange) {
    return cachedData.filter(
      (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
    );
  }  
  let mergedData = undefined;

  return fetchCandles(
    resolution,
    from,
    to,
  ).then((res: any) => {
   
    if (res) {
                
      const formattedData = res.map((item: any) => ({
        time: item.t,
        open: Number(item.o),
        high: Number(item.h),
        low: Number(item.l),
        close: Number(item.c),
        volume: Number(item.v),
      }));

      mergedData = [...cachedData, ...formattedData].sort(
        (a, b) => a.time - b.time
      );
      dataCache.set(key, mergedData);

      return mergedData.filter(
        (bar) => bar.time >= from * 1000 && bar.time <= to * 1000
      );
    }
  });
}