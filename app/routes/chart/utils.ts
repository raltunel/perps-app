import type { ResolutionString } from "~/tv/charting_library";

export const mapResolutionToInterval = (resolution: string): string => {
  const mapping: Record<string, string> = {
    "1": "1m",
    "3": "3m",
    "5": "5m",
    "15": "15m",
    "30": "30m",
    "60": "1h",
    "120": "2h",
    "240": "4h",
    "360": "6h",
    "480": "8h",
    "720": "12h",
    "D": "1d",
    "W": "1w",
    "M": "1M",
  };
  return mapping[resolution] || "1d";
};
  


  export function resolutionToSeconds(resolution: string): number {
    if (resolution === "1D") return 86400;
    if (resolution === "W") return 604800;
    if (resolution === "M") return 2592000;

    return Number(resolution);
  }

  

  export const supportedResolutions = ["1","3","5","15","30","60","120","240","480","720","1D","3D","1W","1M"] as ResolutionString[];