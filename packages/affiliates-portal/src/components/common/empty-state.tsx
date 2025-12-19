"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  variant = "default",
}: EmptyStateProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "text-center",
        isCompact ? "py-8" : "py-12 sm:py-16",
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            "rounded-full flex items-center justify-center mx-auto mb-2",
            isCompact
              ? "w-12 h-12 sm:w-16 sm:h-16"
              : "w-16 h-16 sm:w-20 sm:h-20"
          )}
        >
          <Icon
            className={cn(
              "text-white opacity-80",
              isCompact ? "w-6 h-6 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-10 sm:h-10"
            )}
            strokeWidth={1.5}
          />
        </div>
      )}

      <h3
        className={cn(
          "text-text-primary font-semibold mb-2 sm:mb-3",
          isCompact ? "text-base sm:text-lg" : "text-lg sm:text-xl"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-text-muted max-w-md mx-auto",
            isCompact ? "text-xs sm:text-sm mb-4" : "text-sm sm:text-base mb-6"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
