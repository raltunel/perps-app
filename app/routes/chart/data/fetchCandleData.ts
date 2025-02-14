export const GCGO_TESTNET_URL = "https://ambindexer.net/gcgo-testnet";

export const GCGO_MAINNET = "https://ambindexer.net/gcgo";

function capNumDurations(numDurations: number): number {
  const MAX_NUM_DURATIONS = 5000;
  const MIN_NUM_DURATIONS = 1;

  // Avoid rounding off last candle
  numDurations = numDurations + 1;

  if (numDurations > MAX_NUM_DURATIONS) {
    console.warn(`Candle fetch n=${numDurations} exceeds max cap.`);
    return MAX_NUM_DURATIONS;
  } else if (numDurations < MIN_NUM_DURATIONS) {
    console.warn(`Candle fetch n=${numDurations} non-positive.`);
    return MIN_NUM_DURATIONS;
  }
  return numDurations;
}
export async function fetchCandleSeriesCroc(
  chainId: string,
  poolIndex: number,
  period: number,
  baseTokenAddress: string,
  quoteTokenAddress: string,
  endTime: number,
  nCandles: number
): Promise<any | undefined> {
  const candleSeriesEndpoint = GCGO_MAINNET + "/pool_candles";

  const startTimeRough = endTime - nCandles * period;
  const startTime = Math.ceil(startTimeRough / period) * period;

  const reqOptions = new URLSearchParams({
    base: baseTokenAddress,
    quote: quoteTokenAddress,
    poolIdx: poolIndex.toString(),
    period: period.toString(),
    n: capNumDurations(nCandles).toString(),
    time: startTime.toString(),
    chainId: chainId,
  });

  return fetch(candleSeriesEndpoint + "?" + reqOptions)
    .then((response) => response?.json())
    .then(async (json) => {
      if (!json?.data) {
        return undefined;
      }
      const payload = json?.data;

      return payload;
    })
    .catch((e) => {
      return undefined;
    });
}
