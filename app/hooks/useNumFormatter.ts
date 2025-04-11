import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useAppSettings } from '~/stores/AppSettingsStore';
import { NumFormatTypes, type NumFormat } from '~/utils/Constants';
import type { OrderRowResolutionIF } from '~/utils/orderbook/OrderBookIFs';

export function useNumFormatter() {
    const { numFormat } = useAppSettings();

    const parseNum = useCallback((val: string | number) => {
        return Number(val);
    }, []);

    const getDefaultPrecision = useCallback(
        (num: number | string) => {
            const numVal = Math.abs(parseNum(num));
            if (numVal > 10000) {
                return 0;
            } else if (numVal > 1000) {
                return 1;
            } else if (numVal > 100) {
                return 2;
            } else if (numVal < 10) {
                return 4;
            }
            return 2;
        },
        [parseNum],
    );

    // return the group and decimal separators for a given locale
    function getSeparators(locale: string): { decimal: string; group: string } {
        const numberWithGroupAndDecimal = 1234567.89;

        const parts = new Intl.NumberFormat(locale).formatToParts(
            numberWithGroupAndDecimal,
        );

        const group = parts.find((p) => p.type === 'group')?.value || ',';
        const decimal = parts.find((p) => p.type === 'decimal')?.value || '.';

        return { group, decimal };
    }

    // returns the number of decimal places in a number
    const decimalPrecision = (precisionNumber: number) => {
        if (!precisionNumber.toString().includes('.')) return 0;
        return precisionNumber.toString().split('.')[1].length;
    };

    const formatNum = useCallback(
        (
            num: number | string,
            precision?: number | OrderRowResolutionIF | null,
        ) => {
            const formatType = numFormat.value;

            let precisionVal = null;

            if (precision && typeof precision === 'object') {
                precisionVal = decimalPrecision(precision.val);
            } else if (precision) {
                precisionVal = precision;
            }

            // if (Number.isInteger(num)) {
            //   return num.toLocaleString(formatType);
            // } else {
            return num.toLocaleString(formatType, {
                minimumFractionDigits: precisionVal || getDefaultPrecision(num),
                maximumFractionDigits: precisionVal || getDefaultPrecision(num),
            });
            // }
        },
        [numFormat, parseNum, getDefaultPrecision],
    );

    const formatNumWithOnlyDecimals = useCallback(
        (num: number | string, precision?: number) => {
            const formattedNum = formatNum(num, precision);
            const { group } = getSeparators(numFormat.value);

            return formattedNum.replace(new RegExp(`\\${group}`, 'g'), '');
        },
        [formatNum],
    );

    const parseFormattedWithOnlyDecimals = useCallback(
        (str: string) => {
            const { group, decimal } = getSeparators(numFormat.value);

            const cleaned = str
                .replace(new RegExp(`\\${group}`, 'g'), '')
                .replace(decimal, '.');

            return Number(cleaned);
        },
        [numFormat],
    );

    const parseFormattedNum = useCallback(
        (str: string) => {
            const { group, decimal } = getSeparators(numFormat.value);

            const cleaned = str
                .replace(new RegExp(`\\${group}`, 'g'), '')
                .replace(decimal, '.');

            return Number(cleaned);
        },
        [numFormat],
    );

    const formatPriceForChart = useCallback(
        (num: number | string) => {
            const precision =
                Math.max(
                    5 -
                        Math.floor(
                            Math.log10(Math.abs(parseInt(num.toString())) + 1),
                        ),
                    0,
                ) - 1;
            return formatNum(num, precision >= 0 ? precision : 0);
        },
        [formatNum],
    );

    const activeDecimalSeparator = useMemo(() => {
        return getSeparators(numFormat.value).decimal;
    }, [numFormat]);

    const activeGroupSeparator = useMemo(() => {
        return getSeparators(numFormat.value).group;
    }, [numFormat]);

    const inputRegex = useMemo(() => {
        return new RegExp(`^\\d*(?:${activeDecimalSeparator}\\d*)?$`);
    }, [activeDecimalSeparator]);

    return {
        formatNum,
        formatPriceForChart,
        decimalPrecision,
        getDefaultPrecision,
        parseFormattedNum,
        formatNumWithOnlyDecimals,
        parseFormattedWithOnlyDecimals,
        activeDecimalSeparator,
        activeGroupSeparator,
        inputRegex,
    };
}

export default useNumFormatter;
