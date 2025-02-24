import type { OrderRowResolutionIF } from "./OrderBookIFs";


  export const calculateResolutionValue = (price: number, nsigfigs = 2, mantissa?: number) => {
    const magnitude = Math.floor(Math.log10(price));
    // Compute the exponent: order of magnitude minus (nsigfigs - 1)
    const exponent = magnitude - (nsigfigs - 1);
    // Calculate the tick size as 10 raised to the computed exponent
    const tickSize = Math.pow(10, exponent);
    return tickSize * (mantissa || 1);
  }
  
  export const createResolutionObject = (price: number, nsigfigs: number, mantissa?: number) => {
    return {
        nsigfigs: nsigfigs,
        val: calculateResolutionValue(price, nsigfigs, mantissa || 1),
        mantissa: mantissa || null,
    }
  }

  const floorNum = (num: number, precision?: number) => {
    if(precision) {
        return Math.floor(num * Math.pow(10, precision));
    }
    return Math.floor(num);
  }
  
  export const parseNum = (val : string | number) => {
    return Number(val);
  }

  const getDefaultPrecision = (num: number | string) => {
    const numVal = parseNum(num);
    if(numVal > 1000000){
        return 0;
    }
    return 2;
  }

  export const formatNum = (num: number | string, precision?: number) => {

        if (Number.isInteger(num)) {
          return num.toLocaleString('de-DE');
        } else {
          return num.toLocaleString('de-DE', {
            minimumFractionDigits: getDefaultPrecision(num),
            maximumFractionDigits: getDefaultPrecision(num)
          });
        }
  }

  
  export const getResolutionListForPrice = (price: number | string): OrderRowResolutionIF[] => {
  
      
    const ret: OrderRowResolutionIF[] = [];
    
    const priceNum = Number(price);
    ret.push(createResolutionObject(priceNum, 5));
    ret.push(createResolutionObject(priceNum, 5, 2));
    ret.push(createResolutionObject(priceNum, 5, 5));
    ret.push(createResolutionObject(priceNum, 4));
    ret.push(createResolutionObject(priceNum, 3));
    ret.push(createResolutionObject(priceNum, 2));
    
    return ret;
  }
