import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

function GlasmorphicTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      data-variant="glassmorphic"
      className={cn(
        "w-full bg-surface-elevated border border-gray-400/50 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-600 text-sm resize-none min-h-[80px]",
        "focus:outline-none focus:border-blue-400 focus:bg-surface-elevated",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Textarea, GlasmorphicTextarea }
