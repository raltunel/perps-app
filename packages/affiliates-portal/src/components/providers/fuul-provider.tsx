"use client";

import { useEffect } from "react";
import { Fuul } from "@fuul/sdk";

export function FuulProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_FUUL_SDK_API_KEY;

    if (!apiKey) {
      console.warn(
        "Problem with the API key or base API URL. Fuul SDK will not be initialized."
      );
      return;
    }

    Fuul.init({ apiKey });
  }, []);

  return <>{children}</>;
}
