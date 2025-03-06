import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useTradeDataStore } from '~/stores/TradeDataStore';
import { NumFormatTypes, type NumFormat } from '~/utils/Constants';






export function useNumFormatter() {

  const { numFormat, setNumFormat } = useTradeDataStore();



  return ;
}

export default useNumFormatter;