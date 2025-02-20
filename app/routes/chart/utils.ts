export const mapResolutionToInterval = (resolution: string): string => {
    const mapping: Record<string, string> = {
      "1": "1m",
      "5": "5m",
      "15": "15m",
      "60": "1h",
      "240": "4h",
      "D": "1d",
      "W": "1w",
    };
    return mapping[resolution] || "1d";
  };
  