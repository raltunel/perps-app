"use client";

import { Toaster } from "sonner";

export function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "hsl(var(--surface))",
          border: "1px solid hsl(var(--border-default))",
          color: "hsl(var(--text-primary))",
        },
        classNames: {
          error: "!bg-[#2a1215] !border-destructive !text-destructive",
        },
      }}
    />
  );
}
