import { useCallback } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import type { OrderRowResolutionIF } from '~/utils/orderbook/OrderBookIFs';






export function useNumFormatter() {

  const { numFormat } = useAppSettings();

  const parseNum = useCallback((val: string | number) => {
    return Number(val);
  }, []);

  const getDefaultPrecision = useCallback((num: number | string) => {
    const numVal = parseNum(num);
    if (numVal > 1000000) {
      return 0;
    }
    else if (numVal < 10) {
      return 4;
    }
    return 2;
  }, [parseNum]);


  // returns the number of decimal places in a number
  const decimalPrecision = (precisionNumber: number) => {
    if (!precisionNumber.toString().includes('.')) return 0;
    return precisionNumber.toString().split('.')[1].length;
  }


  const formatNum = useCallback((num: number | string, precision?: number | OrderRowResolutionIF | null) => {

    const formatType = numFormat.value;

    let precisionVal = null;

    if (precision && typeof precision === 'object') {
      precisionVal = decimalPrecision(precision.val);
    }
    else if (precision) {
      precisionVal = precision;
    }

    if (Number.isInteger(num)) {
      return num.toLocaleString(formatType);
    } else {
      return num.toLocaleString(formatType, {
        minimumFractionDigits: precisionVal || getDefaultPrecision(num),
        maximumFractionDigits: precisionVal || getDefaultPrecision(num)
      });
    }

  }, [numFormat, parseNum, getDefaultPrecision]);

  const formatPriceForChart = useCallback((num: number | string) => {
    const precision = Math.max(5 - Math.floor(Math.log10(Math.abs(parseInt(num.toString())) + 1)), 0) - 1;
    return formatNum(num, precision >= 0 ? precision : 0);
  }, [formatNum]);



  return { formatNum, formatPriceForChart, decimalPrecision };
}

export default useNumFormatter;