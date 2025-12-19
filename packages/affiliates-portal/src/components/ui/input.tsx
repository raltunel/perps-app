import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function GlasmorphicInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      data-variant="glassmorphic"
      className={cn(
        "w-full bg-surface-elevated border border-gray-400/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-600 text-sm",
        "focus:outline-none focus:border-blue-400 focus:bg-surface-elevated",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        type === "file" && "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200/80 file:text-gray-800 hover:file:bg-gray-300/80",
        className
      )}
      {...props}
    />
  )
}

export { Input, GlasmorphicInput }
